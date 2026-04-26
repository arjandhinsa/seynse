from uuid import uuid4

from sqlalchemy import event
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

from app.config import settings


is_postgres = "postgresql" in settings.DATABASE_URL or "supabase" in settings.DATABASE_URL
is_sqlite = "sqlite" in settings.DATABASE_URL

# Supabase + Postgres copy-paste URLs come as `postgresql://...`, which
# SQLAlchemy routes to psycopg2 (sync). create_async_engine needs an async
# driver, and the connect_args below are asyncpg-specific anyway.
db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = "postgresql+asyncpg://" + db_url[len("postgresql://"):]

engine = create_async_engine(
    db_url,
    echo=(settings.APP_ENV == "development"),
    poolclass=NullPool if is_postgres else None,
    connect_args={
        "statement_cache_size": 0,
        "prepared_statement_cache_size": 0,
        "prepared_statement_name_func": lambda: f"__asyncpg_{uuid4()}__",
    } if is_postgres else {},
)

# SQLite doesn't enforce foreign-key constraints by default. Without this,
# ondelete=CASCADE / SET NULL rules silently no-op — deleting a user would
# leave orphans in challenge_completions, conversations, etc.
# Postgres enforces FKs natively so this only fires in dev.
if is_sqlite:
    @event.listens_for(engine.sync_engine, "connect")
    def _enable_sqlite_fk(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()