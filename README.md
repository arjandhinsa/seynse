# Seynsei - A Social Confidence Coach 

A full-stack LLM powered social anxiety coaching app built on **graduated exposure therapy** often used in CBT. 


Users can work through progressively more challenging social situations across two domains, namely: 'Everyday Social' and 'Dating & Connection'.  


The users are supported by an AI coaching conversation that validates feelings, reframes anxious thoughts, and suggests micro-steps.


## How It Works

Seynsei implements a clinically-informed exposure hierarchy based on the Clark & Wells (1995) cognitive model of social anxiety. Challenges are structured across 5 difficulty levels (mapped to SUDS bands) and 2 domains:

- **Everyday Social** — casual interactions, small talk, group settings
- **Dating & Connection** — romantic confidence, vulnerability, rejection tolerance

Each challenge targets a specific safety behaviour and cognitive distortion.  

Users rate their anxiety before and after (SUDS scale, 0-10) to track progress over time.


## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + Vite | Component-based UI with React Router |
| Backend | Python + FastAPI | Async REST API with auto-generated docs |
| Database | SQLite (dev) / PostgreSQL (prod) | Relational data via SQLAlchemy 2.0 |
| Auth | JWT (access + refresh tokens) | Stateless authentication with bcrypt |
| AI | OpenAI GPT-4o-mini | Coaching conversations with CBT-informed prompting |

## Features

- **Graduated exposure system** — 18 challenges across 2 domains, 5 difficulty tiers, xp points based 
- **AI coaching conversations** — Seynsei responds with empathy, validates feelings before offering strategies
- **SUDS anxiety tracking** — Rate anxiety before/after challenges to visualise progress
- **Progress dashboard** — Overall and per-domain completion tracking
- **JWT authentication** — Secure register/login with token refresh

## Running Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your OpenAI API key and generate a SECRET_KEY
python seed.py
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:8000` (API docs at `/docs`)


Frontend runs on `http://localhost:5173`

## Therapeutic References

- Clark, D.M. & Wells, A. (1995). A cognitive model of social phobia. *Social Phobia: Diagnosis, Assessment, and Treatment*. Guilford Press.
- Hofmann, S.G. (2007). Cognitive factors that maintain social anxiety disorder. *Cognitive Behaviour Therapy*, 36(4), 193-209.
- Wolpe, J. (1969). The practice of behavior therapy. Pergamon Press. (SUDS scale)

## Status

Active development. 

Core backend and frontend complete. 

Next: gameify, XP points, a point system rather than levels, UI update
