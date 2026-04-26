from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from app.middleware.auth import get_current_user


router = APIRouter()

# --- Request/Response shapes ---

class RegisterRequest(BaseModel):
    email: str
    password: str
    display_name: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: str
    email: str
    display_name: str | None
    equipped_avatar_id: str | None

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Create user with hashed password — never store plaintext
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        display_name=body.display_name,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)  # Reload from DB to get the generated ID

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Look up user by email
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    # Deliberately vague error — don't reveal whether the email exists
    # "Wrong password" tells an attacker the email IS registered
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated",
        )

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshRequest):
    # Exchange a valid refresh token for new tokens
    # Called when the frontend's access token expires
    user_id = verify_token(body.refresh_token, expected_type="refresh")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )

@router.get("/me", response_model=UserResponse)
async def get_me(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Protected route — get_current_user runs first
    # If the token is invalid, this code never runs
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        equipped_avatar_id=user.equipped_avatar_id, 
    )

class UpdateMeRequest(BaseModel):
    """All fields optional. Only fields present in the request body get
    updated; others are left untouched. Pass `null` explicitly to clear
    a nullable field (e.g. unequip an avatar)."""
    display_name: str | None = None
    equipped_avatar_id: str | None = None


@router.patch("/me", response_model=UserResponse)
async def update_me(
    body: UpdateMeRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update the current user's profile fields. PATCH semantics — only
    fields present in the request body are touched. Use the body of the
    request payload (not query strings) to differentiate "field omitted"
    from "field explicitly set to null".

    Validation that an avatar code is real / unlocked happens client-side
    for v1 (the catalogue is hard-coded in the frontend; unlocks are
    level-derived). Move server-side if/when the catalogue moves.
    """
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # PATCH semantics: use model_dump(exclude_unset=True) so we only
    # touch fields the client explicitly sent.
    updates = body.model_dump(exclude_unset=True)

    if "display_name" in updates:
        # Treat empty/whitespace as null (clears the name)
        name = updates["display_name"]
        user.display_name = name.strip() if name and name.strip() else None

    if "equipped_avatar_id" in updates:
        user.equipped_avatar_id = updates["equipped_avatar_id"]

    await db.commit()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        email=user.email,
        display_name=user.display_name,
        equipped_avatar_id=user.equipped_avatar_id,
    )


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_me(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Hard-delete the current user and everything associated. All FKs to
    users.id use ondelete=CASCADE, so the DB drops the user's
    challenge_completions, conversations (and their messages),
    user_achievements, and recommendation_logs in one go."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(user)
    await db.commit()
    # 204 — frontend handles logout + redirect.