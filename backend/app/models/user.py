import uuid #generates unqiqe ids
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()), #generates a unique id for each user
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    ) #users email for login

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    ) #hashed password for security

    display_name: Mapped[str] = mapped_column(
        String(100),
        nullable=True,
    ) #optional display name for the user

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    ) #indicates if the user account is active

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    ) #timestamp for when the user account was created

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    ) #timestamp for when the user account was last updated

    completions = relationship("ChallengeCompletion", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")