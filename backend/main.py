from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base


# Import route modules 
from app.routes import auth, challenges, conversations, progress



# Runs once on server startup, once on shutdown
# Creates all database tables from your models on first run
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Import models here so Base knows about them before creating tables
    from app.models.user import User
    from app.models.challenge import Challenge, ChallengeCompletion
    from app.models.conversation import Conversation, Message

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print(f"✓ {settings.APP_NAME} started — tables created")
    yield
    print(f"✓ {settings.APP_NAME} stopped")


# Create the FastAPI app
app = FastAPI(
    title="Seynse API",
    description="Social Confidence Coach — Backend API",
    version="0.1.0",
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