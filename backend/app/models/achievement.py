import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# Master catalog of every achievement that can exist in the system.
# One row per achievement definition — shared across all users.
class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # Stable programmatic identifier used by the achievements service
    # to look up and unlock specific achievements (e.g. "streak_7", "first_tier_5").
    # Preferred over matching by `name` because display names may get reworded.
    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    # Human-readable name shown in UI
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    # Icon identifier — emoji, lucide-react name, or asset filename.
    # Storing a string lets the frontend decide how to render it.
    icon: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    )

    # Broad category of unlock condition. The achievements service routes each
    # type to the matching check. Kept as a free string (not a DB enum) so
    # adding a new category doesn't require a schema migration — just a
    # code change in the service.
    # Examples: 'total_completions', 'streak_days', 'tier_reached',
    # 'xp_milestone', 'challenge_repeat_count', 'domain_balance'
    condition_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Threshold paired with condition_type.
    # e.g. condition_type='streak_days' + condition_value=7 → "7-day streak"
    condition_value: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    # Bonus XP granted when this achievement unlocks.
    # This is ON TOP of the XP from the completion that triggered it.
    xp_bonus: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    unlocks = relationship("UserAchievement", back_populates="achievement")


# Records WHICH user unlocked WHICH achievement and WHEN.
# A user can only unlock each achievement once (UniqueConstraint).
class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    achievement_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("achievements.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    unlocked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="unlocks")

    __table_args__ = (
        UniqueConstraint("user_id", "achievement_id", name="uq_user_achievement"),
    )