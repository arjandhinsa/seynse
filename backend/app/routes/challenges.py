from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.models.challenge import Challenge, ChallengeCompletion
from app.middleware.auth import get_current_user


router = APIRouter()


# --- Schemas ---

class ChallengeResponse(BaseModel):
    id: str
    domain: str
    title: str
    description: str
    tip: str | None
    rationale: str | None
    level: int

class CompletionRequest(BaseModel):
    anxiety_before: int | None = None
    anxiety_after: int | None = None
    notes: str | None = None

class CompletionResponse(BaseModel):
    id: str
    challenge_id: str
    completed_at: str
    anxiety_before: int | None
    anxiety_after: int | None
    notes: str | None


# --- Endpoints ---

@router.get("/", response_model=list[ChallengeResponse])
async def list_challenges(
    domain: str | None = Query(None, description="Filter: social, professional, romantic"),
    level: int | None = Query(None, ge=1, le=5, description="Filter by level 1-5"),
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    # Builds a query dynamically based on filters
    # GET /api/challenges/ → all challenges
    # GET /api/challenges/?domain=social → social only
    # GET /api/challenges/?domain=social&level=2 → social level 2
    query = select(Challenge).order_by(Challenge.domain, Challenge.level, Challenge.sort_order)

    if domain:
        query = query.where(Challenge.domain == domain)
    if level:
        query = query.where(Challenge.level == level)

    result = await db.execute(query)
    challenges = result.scalars().all()

    return [
        ChallengeResponse(
            id=c.id,
            domain=c.domain,
            title=c.title,
            description=c.description,
            tip=c.tip,
            rationale=c.rationale,
            level=c.level,
        )
        for c in challenges
    ]


@router.get("/completions", response_model=list[CompletionResponse])
async def get_completions(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Returns all challenges this user has completed
    # Frontend uses this to show which cards are "done"
    result = await db.execute(
        select(ChallengeCompletion)
        .where(ChallengeCompletion.user_id == user_id)
        .order_by(ChallengeCompletion.completed_at.desc())
    )
    completions = result.scalars().all()

    return [
        CompletionResponse(
            id=c.id,
            challenge_id=c.challenge_id,
            completed_at=c.completed_at.isoformat(),
            anxiety_before=c.anxiety_before,
            anxiety_after=c.anxiety_after,
            notes=c.notes,
        )
        for c in completions
    ]


@router.post("/{challenge_id}/complete", response_model=CompletionResponse, status_code=201)
async def complete_challenge(
    challenge_id: str,
    body: CompletionRequest = CompletionRequest(),
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify challenge exists
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Challenge not found")

    # Check if already completed
    result = await db.execute(
        select(ChallengeCompletion).where(
            ChallengeCompletion.user_id == user_id,
            ChallengeCompletion.challenge_id == challenge_id,
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Challenge already completed")

    # Create the completion record
    completion = ChallengeCompletion(
        user_id=user_id,
        challenge_id=challenge_id,
        anxiety_before=body.anxiety_before,
        anxiety_after=body.anxiety_after,
        notes=body.notes,
    )
    db.add(completion)
    await db.commit()
    await db.refresh(completion)

    return CompletionResponse(
        id=completion.id,
        challenge_id=completion.challenge_id,
        completed_at=completion.completed_at.isoformat(),
        anxiety_before=completion.anxiety_before,
        anxiety_after=completion.anxiety_after,
        notes=completion.notes,
    )


@router.delete("/{challenge_id}/complete", status_code=204)
async def uncomplete_challenge(
    challenge_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Undo a completion — useful if user tapped "done" by accident
    result = await db.execute(
        select(ChallengeCompletion).where(
            ChallengeCompletion.user_id == user_id,
            ChallengeCompletion.challenge_id == challenge_id,
        )
    )
    completion = result.scalar_one_or_none()

    if not completion:
        raise HTTPException(status_code=404, detail="Completion not found")

    await db.delete(completion)
    await db.commit()