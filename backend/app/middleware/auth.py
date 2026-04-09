from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.services.auth_service import verify_token

# Extracts the token from the "Authorization: Bearer <token>" header
# If the header is missing, returns 403 automatically
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    # This is a FastAPI "dependency" — add it to any route that needs auth:
    #   @router.get("/protected")
    #   async def my_route(user_id: str = Depends(get_current_user)):
    #       # user_id is guaranteed valid here
    #
    # FastAPI calls this BEFORE your route runs
    # If the token is bad, the route never executes — user gets 401

    token = credentials.credentials

    user_id = verify_token(token, expected_type="access")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id