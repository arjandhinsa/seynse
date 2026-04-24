from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import User
from app.middleware.auth import get_current_user
from app.services.progress_service import DashboardOverview, build_overview
from app.services.recommender import Recommendation, recommend_next


router = APIRouter()


@router.get("/overview", response_model=DashboardOverview)
async def get_overview(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Full dashboard snapshot — XP, level, streak, domain breakdown,
    recent completions, unlocked achievements. One round-trip for the home screen."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await build_overview(user, db)


@router.get("/recommend", response_model=Recommendation | None)
async def get_recommendation(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Rule-based next-challenge recommendation. Will be replaced by the
    Phase 4 ML-assisted recommender."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await recommend_next(user, db)