from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.database import get_db
from app.models.challenge import Challenge, ChallengeCompletion
from app.middleware.auth import get_current_user


router = APIRouter()


# --- Schemas ---

class ProgressSummary(BaseModel):
    total_completed: int
    total_challenges: int
    completion_percentage: float
    # TODO: add current_streak, longest_streak, average_anxiety_reduction

class DomainProgress(BaseModel):
    domain: str
    label: str
    completed: int
    total: int
    percentage: float


DOMAIN_LABELS = {
    "social": "Everyday Social",
    "professional": "Career & Professional",
    "romantic": "Dating & Connection",
}


# --- Endpoints ---

@router.get("/summary", response_model=ProgressSummary)
async def get_summary(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Count total challenges
    result = await db.execute(select(func.count(Challenge.id)))
    total_challenges = result.scalar() or 0

    # Count this user's completions
    result = await db.execute(
        select(func.count(ChallengeCompletion.id))
        .where(ChallengeCompletion.user_id == user_id)
    )
    total_completed = result.scalar() or 0

    pct = round((total_completed / total_challenges * 100), 1) if total_challenges > 0 else 0

    return ProgressSummary(
        total_completed=total_completed,
        total_challenges=total_challenges,
        completion_percentage=pct,
    )


@router.get("/domains", response_model=list[DomainProgress])
async def get_domain_progress(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    results = []

    for domain_key, domain_label in DOMAIN_LABELS.items():
        # Total challenges in this domain
        result = await db.execute(
            select(func.count(Challenge.id))
            .where(Challenge.domain == domain_key)
        )
        total = result.scalar() or 0

        # How many this user has completed in this domain
        result = await db.execute(
            select(func.count(ChallengeCompletion.id))
            .join(Challenge, Challenge.id == ChallengeCompletion.challenge_id)
            .where(
                ChallengeCompletion.user_id == user_id,
                Challenge.domain == domain_key,
            )
        )
        completed = result.scalar() or 0

        results.append(DomainProgress(
            domain=domain_key,
            label=domain_label,
            completed=completed,
            total=total,
            percentage=round((completed / total * 100), 1) if total > 0 else 0,
        ))

    return results

@router.get("/recommend")
async def get_recommendation(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.models.challenge import Challenge, ChallengeCompletion
    from app.services.recommender import recommend_next_challenge

    # Load user's completions with challenge details
    result = await db.execute(
        select(ChallengeCompletion, Challenge)
        .join(Challenge, ChallengeCompletion.challenge_id == Challenge.id)
        .where(ChallengeCompletion.user_id == user_id)
        .order_by(ChallengeCompletion.completed_at)
    )
    rows = result.all()

    completions = [
        {
            "challenge_id": comp.challenge_id,
            "domain": challenge.domain,
            "level": challenge.level,
            "anxiety_before": comp.anxiety_before,
            "anxiety_after": comp.anxiety_after,
        }
        for comp, challenge in rows
    ]

    recommendation = recommend_next_challenge(completions)
    return recommendation