import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.database import get_db
from app.models import Achievement, Challenge, Conversation, Message, User, UserAchievement
from app.middleware.auth import get_current_user
from app.services.coach import get_coach_response
from app.services.xp import level_for_xp


router = APIRouter()


# Display info for the coach's system prompt. Two domains now.
# Update here if a third domain is added.
DOMAIN_INFO = {
    "social": {
        "label": "Social",
        "description": "Daily interactions, friendships, group settings, public-speaking confidence",
    },
    "dating": {
        "label": "Dating",
        "description": "Romantic confidence, vulnerability, and rejection tolerance",
    },
}


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


class ConversationDetailResponse(BaseModel):
    id: str
    challenge_id: str | None
    started_at: str
    messages: list[MessageResponse]


# --- Helpers ---

def _challenge_to_dict(challenge: Challenge) -> dict:
    """Shape a Challenge row into the dict the coach prompt expects."""
    return {
        "name": challenge.name,
        "description": challenge.description,
        "tip": challenge.tip,
        "rationale": challenge.rationale,
        "tier": challenge.tier,
    }


async def _build_user_context(user_id: str, db: AsyncSession) -> dict | None:
    """Gamification state for the coach prompt: level, streak, most recent unlock.
    Returns None if user not found (caller decides how to handle)."""
    user = await db.get(User, user_id)
    if not user:
        return None

    recent_unlock = (await db.execute(
        select(Achievement.name)
        .join(UserAchievement, UserAchievement.achievement_id == Achievement.id)
        .where(UserAchievement.user_id == user_id)
        .order_by(UserAchievement.unlocked_at.desc())
        .limit(1)
    )).scalar_one_or_none()

    return {
        "current_level": level_for_xp(user.total_xp),
        "current_streak": user.current_streak,
        "longest_streak": user.longest_streak,
        "recent_unlock": recent_unlock,
    }


# --- Endpoints ---

@router.post("/", response_model=ConversationDetailResponse, status_code=201)
async def start_conversation(
    body: StartConversationRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    challenge = await db.get(Challenge, body.challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    conversation = Conversation(user_id=user_id, challenge_id=challenge.id)
    db.add(conversation)
    await db.flush()

    challenge_data = _challenge_to_dict(challenge)
    domain_data = DOMAIN_INFO.get(challenge.domain, {})
    user_context = await _build_user_context(user_id, db)

    ai_response = await get_coach_response(
        user_message=None,
        conversation_history=[],
        challenge=challenge_data,
        domain=domain_data,
        user_context=user_context,
    )

    coach_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response["content"],
        api_metadata=json.dumps(ai_response["usage"]),
    )
    db.add(coach_msg)

    conversation.total_tokens = (
        ai_response["usage"]["input_tokens"]
        + ai_response["usage"]["output_tokens"]
    )

    await db.commit()
    await db.refresh(conversation)
    await db.refresh(coach_msg)

    return ConversationDetailResponse(
        id=conversation.id,
        challenge_id=conversation.challenge_id,
        started_at=conversation.started_at.isoformat(),
        messages=[MessageResponse(
            id=coach_msg.id,
            role=coach_msg.role,
            content=coach_msg.content,
            created_at=coach_msg.created_at.isoformat(),
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
    challenge_data: dict = {}
    domain_data: dict = {}
    if conversation.challenge_id:
        challenge = await db.get(Challenge, conversation.challenge_id)
        if challenge:
            challenge_data = _challenge_to_dict(challenge)
            domain_data = DOMAIN_INFO.get(challenge.domain, {})

    # Gamification context fetched on every message so the coach sees
    # the current XP/streak — including any completion between messages.
    user_context = await _build_user_context(user_id, db)

    history = [{"role": m.role, "content": m.content} for m in conversation.messages]

    # Store user message
    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=body.content,
    )
    db.add(user_msg)

    ai_response = await get_coach_response(
        user_message=body.content,
        conversation_history=history,
        challenge=challenge_data,
        domain=domain_data,
        user_context=user_context,
    )

    coach_msg = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response["content"],
        api_metadata=json.dumps(ai_response["usage"]),
    )
    db.add(coach_msg)

    conversation.last_message_at = datetime.now(timezone.utc)
    conversation.total_tokens += (
        ai_response["usage"]["input_tokens"]
        + ai_response["usage"]["output_tokens"]
    )

    await db.commit()
    await db.refresh(coach_msg)

    return MessageResponse(
        id=coach_msg.id,
        role=coach_msg.role,
        content=coach_msg.content,
        created_at=coach_msg.created_at.isoformat(),
    )