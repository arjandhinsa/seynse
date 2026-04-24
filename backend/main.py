from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
import app.models  # noqa: F401 — import for side effect: registers all models with SQLAlchemy
from app.routes import auth, challenges, conversations, progress


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create any missing tables on startup. Safe to re-run — create_all is
    a no-op for tables that already exist. For schema changes, use
    `python seed.py --wipe` or a proper migration."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print(f"✓ {settings.APP_NAME} started — tables created")
    yield
    print(f"✓ {settings.APP_NAME} stopped")


# Create the FastAPI app
app = FastAPI(
    title="Seynsei API",
    description="Social Confidence Coach — Backend API",
    version="0.2.0",
    lifespan=lifespan,
)

# CORS middleware to allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)       

# Register routes — uncomment these as you build each one
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(challenges.router, prefix="/api/challenges", tags=["Challenges"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["Conversations"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])

# Health check — simple endpoint to verify the server is running
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)