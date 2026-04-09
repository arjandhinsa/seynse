import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.database import get_db
from app.models.conversation import Conversation, Message
from app.models.challenge import Challenge
from app.middleware.auth import get_current_user
from app.services.coach import get_coach_response


router = APIRouter()


# --- Schemas ---

class StartConversationRequest(BaseModel):
    challenge_id: str

class SendMessageRequest(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str

class ConversationListResponse(BaseModel):
    id: str
    challenge_id: str | None
    started_at: str
    last_message_at: str
    message_count: int

class ConversationDetailResponse(BaseModel):
    id: str
    challenge_id: str | None
    started_at: str
    messages: list[MessageResponse]

# Domain display info for the system prompt
DOMAIN_INFO = {
    "social": {"label": "Everyday Social", "description": "Daily interactions & casual conversations"},
    "professional": {"label": "Career & Professional", "description": "Interviews, networking & workplace confidence"},
    "romantic": {"label": "Dating & Connection", "description": "Building confidence in romantic contexts"},
}

# --- Endpoints ---

@router.post("/", response_model=ConversationDetailResponse, status_code=201)
async def start_conversation(
    body: StartConversationRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Look up the challenge
    result = await db.execute(select(Challenge).where(Challenge.id == body.challenge_id))
    challenge = result.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    # Create conversation record
    conversation = Conversation(user_id=user_id, challenge_id=challenge.id)
    db.add(conversation)
    await db.flush()  # Get the ID without committing yet

    # Build data dicts for the coach service
    challenge_data = {
        "title": challenge.title,
        "description": challenge.description,
        "tip": challenge.tip,
        "rationale": challenge.rationale,
        "level": challenge.level,
    }
    domain_data = DOMAIN_INFO.get(challenge.domain, {})

    # get the coach's first message based on the challenge
    ai_response = await get_coach_response(
        user_message=None,
        conversation_history=[],
        challenge=challenge_data,
        domain=domain_data,
    )

    # store the coach's message
    seynse_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response["content"],
        api_metadata=json.dumps(ai_response["usage"]),
    )    
    db.add(seynse_msg)

    conversation.total_tokens = (
        ai_response["usage"]["input_tokens"]
        + ai_response["usage"]["output_tokens"]
    )

    await db.commit()
    await db.refresh(conversation)
    await db.refresh(seynse_msg)

    return ConversationDetailResponse(
        id=conversation.id,
        challenge_id=conversation.challenge_id,
        started_at=conversation.started_at.isoformat(),
        messages=[MessageResponse(
            id=seynse_msg.id,
            role=seynse_msg.role,
            content=seynse_msg.content,
            created_at=seynse_msg.created_at.isoformat(),
        )],
    )

@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: str,
    body: SendMessageRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Load conversation with messages — verify ownership
    result = await db.execute(
        select(Conversation)
        .where(Conversation.id == conversation_id, Conversation.user_id == user_id)
        .options(selectinload(Conversation.messages))
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Load challenge for the system prompt
    challenge_data = {}
    domain_data = {}
    if conversation.challenge_id:
        result = await db.execute(
            select(Challenge).where(Challenge.id == conversation.challenge_id)
        )
        challenge = result.scalar_one_or_none()
        if challenge:
            challenge_data = {
                "title": challenge.title,
                "description": challenge.description,
                "tip": challenge.tip,
                "rationale": challenge.rationale,
                "level": challenge.level,
            }
            domain_data = DOMAIN_INFO.get(challenge.domain, {})

    # Build history for the API
    history = [{"role": m.role, "content": m.content} for m in conversation.messages]

    # Store user message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=body.content,
    )
    db.add(user_msg)

    # Call OpenAI
    ai_response = await get_coach_response(
        user_message=body.content,
        conversation_history=history,
        challenge=challenge_data,
        domain=domain_data,
    )

    # Store seynse reply
    seynse_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response["content"],
        api_metadata=json.dumps(ai_response["usage"]),
    )
    db.add(seynse_msg)

    # Update conversation metadata
    conversation.last_message_at = datetime.now(timezone.utc)
    conversation.total_tokens += (
        ai_response["usage"]["input_tokens"]
        + ai_response["usage"]["output_tokens"]
    )

    await db.commit()
    await db.refresh(seynse_msg)

    return MessageResponse(
        id=seynse_msg.id,
        role=seynse_msg.role,
        content=seynse_msg.content,
        created_at=seynse_msg.created_at.isoformat(),
    )