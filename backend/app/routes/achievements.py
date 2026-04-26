from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.models import Achievement
from app.middleware.auth import get_current_user


router = APIRouter()


class AchievementCatalogEntry(BaseModel):
    id: str
    code: str
    name: str
    description: str | None
    icon: str | None
    condition_type: str
    condition_value: int
    xp_bonus: int


@router.get("/", response_model=list[AchievementCatalogEntry])
async def list_achievements(
    _user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Full achievements catalogue — no per-user filtering. The frontend
    joins this with the user's `unlocked` array (from /progress/overview)
    to render unlocked vs. locked.

    Sorted by condition_type then condition_value ascending so the
    frontend gets a predictable order to render against."""
    rows = (await db.execute(
        select(Achievement)
        .order_by(Achievement.condition_type, Achievement.condition_value)
    )).scalars().all()

    return [
        AchievementCatalogEntry(
            id=a.id,
            code=a.code,
            name=a.name,
            description=a.description,
            icon=a.icon,
            condition_type=a.condition_type,
            condition_value=a.condition_value,
            xp_bonus=a.xp_bonus,
        )
        for a in rows
    ]
