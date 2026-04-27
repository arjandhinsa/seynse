# Seynsei

A social anxiety coaching app grounded in cognitive behavioural therapy. Users practise progressively harder social situations across two domains, supported by an AI coach trained to validate, reframe, and suggest small next steps.

## How it works

Seynsei implements a clinically informed exposure hierarchy based on the Clark and Wells (1995) cognitive model of social anxiety. Challenges are organised across five tiers and two domains.

**Social.** Daily interactions, friendships, group settings, public speaking confidence.

**Dating.** Romantic confidence, vulnerability, rejection tolerance.

Each challenge targets a specific safety behaviour and cognitive distortion. Tier 1 is presence (simple eye contact, smiling). Tier 5 is vulnerability (sharing real feelings, handling rejection). Users rate their anxiety from 1 to 10 before and after, so progress over repetition is visible.

The system is gamified. Each completion earns XP based on the tier. Streaks reward consecutive days. Achievements unlock at milestones. Levels derive from total XP and signal where the user is on the path: Hidden, Seeker, Apprentice, Adept, Open, Sage.

A coach named Sensei runs through the OpenAI API. Sensei opens with prep guidance when the user is approaching a challenge, or reflection when they have just finished one. The system prompt is tightly bounded to keep replies short, in character, and free of textbook phrasing.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, React Router, TanStack Query |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0 (async), Alembic |
| Database | Postgres (via Supabase) in production, SQLite locally |
| Auth | JWT with refresh tokens, bcrypt password hashing |
| AI | OpenAI gpt-4o-mini |
| Hosting | Vercel (frontend), Render (backend) |

## Architecture

The recommendation logic is rule based for the first hundreds of users. A planned phase 4 introduces an XGBoost engagement scorer trained on real user behaviour, gated by clinical rules so the model never overrides anti-avoidance constraints. Every recommendation is logged from day one to build the training corpus.

The schema is owned by Alembic. Schema changes are additive migrations, never destructive. The seed script populates the challenge and achievement catalogues but does not own table creation.

## Running locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# fill in OPENAI_API_KEY and a SECRET_KEY
alembic upgrade head
python seed.py
uvicorn main:app --reload
```

API on http://localhost:8000. Auto generated OpenAPI docs at /docs.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend on http://localhost:5173.

## Database migrations

Alembic owns the schema. **Never run `python seed.py --wipe` in production.** It drops every table.

### Adding a new column, table, or index

1. Edit the SQLAlchemy model in `backend/app/models/`.
2. From `backend/`, run:

   ```bash
   alembic revision --autogenerate -m "short description"
   ```

3. Open the generated file in `alembic/versions/` and review the diff. Autogenerate is not perfect. Check that column types, defaults, and FK ondelete behaviours match what you intended.
4. Apply locally:

   ```bash
   alembic upgrade head
   ```

5. Commit both the model change and the migration file in the same PR.
6. On deploy, the Procfile `release` hook runs `alembic upgrade head` automatically. If it fails, the deploy is aborted.

### Inspecting state

```bash
alembic current     # current revision the DB is at
alembic history     # all revisions
alembic check       # report if models drift from the current schema
```

### Rolling back a migration locally

```bash
alembic downgrade -1
```

### Resetting dev only

```bash
python seed.py --wipe
```

Destructive. Drops all tables, re-runs alembic, reseeds the catalogue.

### Fresh checkout

```bash
alembic upgrade head
python seed.py
```

### How env.py picks the DB

`backend/alembic/env.py` reads `settings.DATABASE_URL` from `.env` and converts the async driver to its sync equivalent. Alembic itself runs sync.

- `sqlite+aiosqlite://...` becomes `sqlite://...`
- `postgresql+asyncpg://...` becomes `postgresql+psycopg2://...`

So one `DATABASE_URL` works for the app and Alembic across dev and prod.

## Therapeutic references

- Clark, D. M. and Wells, A. (1995). A cognitive model of social phobia. *Social Phobia: Diagnosis, Assessment, and Treatment*. Guilford Press.
- Hofmann, S. G. (2007). Cognitive factors that maintain social anxiety disorder. *Cognitive Behaviour Therapy*, 36(4), 193 to 209.
- Wolpe, J. (1969). The practice of behaviour therapy. Pergamon Press. (SUDS scale)

## Status

Phase 5 complete. Ready for first deploy. Avatar art and the ML recommender are deferred until real user data accumulates.

