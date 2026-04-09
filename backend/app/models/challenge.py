import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

# The master list of challenges that users can complete
class Challenge(Base):
    __tablename__ = "challenges"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # Which domain this challenge belongs to
    domain: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        index=True,
    ) 

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Optional tip or hint for the challenge
    tip: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    ) 

    # CBT rationale explaining why this challenge is helpful for anxiety
    rationale: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    ) 

    # Difficulty scale 1-5
    # 1 = smile at a stranger, 5 = share something vulnerable
    level: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )   
    
    # Controls the display order within a domain
    # So challenges appear in a sensible sequence
    sort_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    completions = relationship("ChallengeCompletion", back_populates="challenge")


# Records when a specific user completes a specific challenge
# "junction table" for the many-to-many relationship between users and challenges.
class ChallengeCompletion(Base):
    __tablename__ = "challenge_completions"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )

    # Foreign keys to link to the user and challenge
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    challenge_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("challenges.id", ondelete="CASCADE"),
        nullable=False,
    )

    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    # SUDS (Subjective Units of Distress) ratings
    # Scale: 0 = no anxiety, 100 = worst anxiety imaginable
    # Users rate before and after attempting the challenge
    # Tracking both lets them SEE their anxiety dropping over time
    # nullable=True because these are optional — user can skip the rating
    anxiety_before: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
    )

    anxiety_after: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
    )

    # Optional personal reflection — "what happened vs what I predicted"
    notes: Mapped[str] = mapped_column(
        Text,
        nullable=True,
    )

    # Two-way relationships back to User and Challenge
    # completion.user → the User who completed it
    # completion.challenge → which Challenge they completed
    user = relationship("User", back_populates="completions")
    challenge = relationship("Challenge", back_populates="completions")

    # UniqueConstraint — a user can only complete each challenge ONCE
    # Without this, you could accidentally create duplicate completions
    __table_args__ = (
        UniqueConstraint("user_id", "challenge_id", name="uq_user_challenge"),
    )