# Importing each model module here registers all model classes with
# SQLAlchemy's mapper before any relationship resolves. Without these
# imports, a string-based relationship like
# `relationship("UserAchievement", back_populates="user")`
# blows up at query time because the mapper has never heard of the
# target class.
#
# Consequence: anywhere in the app, `import app.models` (or importing
# any single model) is enough — every model gets registered transitively.

from app.models.user import User
from app.models.challenge import Challenge, ChallengeCompletion
from app.models.conversation import Conversation, Message
from app.models.achievement import Achievement, UserAchievement
from app.models.recommendation_log import RecommendationLog

__all__ = [
    "User",
    "Challenge",
    "ChallengeCompletion",
    "Conversation",
    "Message",
    "Achievement",
    "UserAchievement",
    "RecommendationLog",
]
