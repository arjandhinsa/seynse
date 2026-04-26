from logging.config import fileConfig

from sqlalchemy import create_engine, pool

from alembic import context

from app.config import settings
from app.database import Base
import app.models  # noqa: F401 — registers all models on Base.metadata

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _sync_url() -> str:
    """Convert the app's async DATABASE_URL into a sync one for Alembic.

    Alembic itself runs sync. SQLite uses the stdlib driver; Postgres uses
    psycopg2. Keeps a single DATABASE_URL in .env across dev and prod.
    """
    return (
        settings.DATABASE_URL
        .replace("+aiosqlite", "")
        .replace("+asyncpg", "+psycopg2")
    )


def run_migrations_offline() -> None:
    context.configure(
        url=_sync_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    engine = create_engine(_sync_url(), poolclass=pool.NullPool)

    with engine.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
