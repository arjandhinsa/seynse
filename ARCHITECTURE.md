# Seynse — Architecture Reference
## How the Frontend and Python Backend Connect

---

## 1. Folder Structure

```
seynse/
├── .gitignore
├── .env.example
│
├── backend/
│   ├── requirements.txt
│   ├── .env                        ← YOUR secrets (never commit)
│   ├── main.py                     ← FastAPI entry point
│   ├── seed.py                     ← Populates challenges table once
│   │
│   └── app/
│       ├── __init__.py
│       ├── config.py               ← Loads .env into a Settings object
│       ├── database.py             ← SQLAlchemy engine + session + Base
│       │
│       ├── models/
│       │   ├── __init__.py
│       │   ├── user.py             ← User table
│       │   ├── challenge.py        ← Challenge + ChallengeCompletion tables
│       │   └── conversation.py     ← Conversation + Message tables
│       │
│       ├── routes/
│       │   ├── __init__.py
│       │   ├── auth.py             ← /api/auth/*
│       │   ├── challenges.py       ← /api/challenges/*
│       │   ├── conversations.py    ← /api/conversations/*
│       │   └── progress.py         ← /api/progress/*
│       │
│       ├── services/
│       │   ├── __init__.py
│       │   ├── auth_service.py     ← Password hashing, JWT creation/verification
│       │   ├── coach.py            ← Builds system prompt, calls Anthropic API
│       │   └── progress_service.py ← Streak calc, stats aggregation
│       │
│       └── middleware/
│           ├── __init__.py
│           └── auth.py             ← JWT verification dependency for protected routes
│
└── frontend/
    ├── package.json
    ├── vite.config.js              ← Proxy /api → localhost:8000
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                 ← React Router + AuthProvider
        ├── components/             ← Extract screens from seynse.jsx artifact
        ├── hooks/
        │   └── useAuth.js          ← React Context for login state + token
        ├── services/
        │   └── api.js              ← Centralised fetch wrapper with auth headers
        └── data/
            └── domains.js          ← Static display metadata (colours, icons, labels)
```

---

## 2. The API Contract

This is the exact interface between frontend and backend. Every endpoint, every request shape, every response shape.

### Auth

```
POST /api/auth/register
  Request:  { email: str, password: str, display_name?: str }
  Response: { access_token: str, refresh_token: str, token_type: "bearer" }
  Status:   201 Created | 409 Conflict (email taken)

POST /api/auth/login
  Request:  { email: str, password: str }
  Response: { access_token: str, refresh_token: str, token_type: "bearer" }
  Status:   200 OK | 401 Unauthorized

POST /api/auth/refresh
  Request:  { refresh_token: str }
  Response: { access_token: str, refresh_token: str, token_type: "bearer" }
  Status:   200 OK | 401 Unauthorized

GET /api/auth/me                          [Protected]
  Response: { id: str, email: str, display_name?: str }
```

### Challenges

```
GET /api/challenges/?domain=social&level=2    [Protected]
  Response: [
    {
      id: str,
      domain: str,          ← "social" | "professional" | "romantic"
      title: str,
      description: str,
      tip?: str,
      rationale?: str,
      level: int             ← 1-5
    }
  ]

GET /api/challenges/completions               [Protected]
  Response: [
    {
      id: str,
      challenge_id: str,
      completed_at: str,     ← ISO datetime
      anxiety_before?: int,  ← 0-100 SUDS
      anxiety_after?: int,
      notes?: str
    }
  ]

POST /api/challenges/{challenge_id}/complete  [Protected]
  Request:  { anxiety_before?: int, anxiety_after?: int, notes?: str }
  Response: { id, challenge_id, completed_at, anxiety_before, anxiety_after, notes }
  Status:   201 Created | 409 Conflict (already done)

DELETE /api/challenges/{challenge_id}/complete [Protected]
  Status:   204 No Content
```

### Conversations (the AI coaching chat)

```
POST /api/conversations/                      [Protected]
  Request:  { challenge_id: str }
  Response: {
    id: str,
    challenge_id: str,
    started_at: str,
    messages: [{ id, role, content, created_at }]   ← contains Aria's opening message
  }
  Status:   201 Created

GET /api/conversations/                       [Protected]
  Response: [{ id, challenge_id, started_at, last_message_at, message_count }]

GET /api/conversations/{id}                   [Protected]
  Response: { id, challenge_id, started_at, messages: [{ id, role, content, created_at }] }

POST /api/conversations/{id}/messages         [Protected]
  Request:  { content: str }                  ← user's message text
  Response: { id, role: "assistant", content, created_at }  ← Aria's reply
```

### Progress

```
GET /api/progress/summary                     [Protected]
  Response: {
    total_completed: int,
    total_challenges: int,
    completion_percentage: float,
    current_streak: int,
    longest_streak: int,
    average_anxiety_reduction?: float
  }

GET /api/progress/domains                     [Protected]
  Response: [{ domain, label, completed, total, percentage }]
```

---

## 3. Auth Flow (how tokens move between frontend and backend)

```
┌──────────┐                           ┌──────────┐
│ Frontend │                           │ Backend  │
└────┬─────┘                           └────┬─────┘
     │  POST /api/auth/login                │
     │  { email, password }                 │
     │─────────────────────────────────────>│
     │                                      │  verify password hash
     │                                      │  create JWT tokens
     │  { access_token, refresh_token }     │
     │<─────────────────────────────────────│
     │                                      │
     │  store tokens in memory (useAuth)    │
     │                                      │
     │  GET /api/challenges/                │
     │  Authorization: Bearer <access_token>│
     │─────────────────────────────────────>│
     │                                      │  middleware verifies JWT
     │                                      │  extracts user_id
     │  [challenges array]                  │
     │<─────────────────────────────────────│
     │                                      │
     │  ── access token expires (30 min) ── │
     │                                      │
     │  POST /api/auth/refresh              │
     │  { refresh_token }                   │
     │─────────────────────────────────────>│
     │  { new access_token, new refresh }   │
     │<─────────────────────────────────────│
```

**Frontend stores tokens in React state (useAuth hook), NOT localStorage.**
Every API call includes `Authorization: Bearer <token>` via the api.js wrapper.

---

## 4. Chat Flow (how a coaching conversation works)

```
User taps a challenge card
        │
        ▼
Frontend: POST /api/conversations/  { challenge_id: "abc" }
        │
        ▼
Backend:
  1. Creates Conversation row in DB
  2. Loads challenge data (title, description, tip, rationale, level)
  3. Builds system prompt with challenge context
  4. Calls Anthropic API → gets Aria's opening message
  5. Stores Message row (role: "assistant")
  6. Returns conversation + opening message
        │
        ▼
Frontend: Renders Aria's message with TypeWriter effect
        │
User types a message (or taps a quick reply)
        │
        ▼
Frontend: POST /api/conversations/{id}/messages  { content: "I'm nervous" }
        │
        ▼
Backend:
  1. Loads all previous messages for this conversation
  2. Stores the user's message (role: "user")
  3. Builds messages array: full history + new user message
  4. Calls Anthropic API with system prompt + history
  5. Stores Aria's reply (role: "assistant")
  6. Returns Aria's reply
        │
        ▼
Frontend: Appends reply to chat, renders with TypeWriter
```

**Critical change from the artifact:** The frontend NEVER calls Anthropic directly.
The API key lives on the backend only. Frontend calls YOUR backend, backend calls Anthropic.

---

## 5. Database Schema (4 tables)

```
users
├── id              VARCHAR(36)  PK     ← UUID
├── email           VARCHAR(255) UNIQUE
├── hashed_password VARCHAR(255)        ← bcrypt hash, NEVER plaintext
├── display_name    VARCHAR(100) NULL
├── is_active       BOOLEAN      DEFAULT true
├── created_at      DATETIME
└── updated_at      DATETIME

challenges
├── id              VARCHAR(36)  PK
├── domain          VARCHAR(50)  INDEX  ← "social" | "professional" | "romantic"
├── title           VARCHAR(200)
├── description     TEXT
├── tip             TEXT         NULL
├── rationale       TEXT         NULL
├── level           INTEGER             ← 1-5
└── sort_order      INTEGER

challenge_completions
├── id              VARCHAR(36)  PK
├── user_id         VARCHAR(36)  FK → users.id
├── challenge_id    VARCHAR(36)  FK → challenges.id
├── completed_at    DATETIME
├── anxiety_before  INTEGER      NULL   ← 0-100 SUDS scale
├── anxiety_after   INTEGER      NULL
├── notes           TEXT         NULL
└── UNIQUE(user_id, challenge_id)       ← one completion per user per challenge

conversations
├── id              VARCHAR(36)  PK
├── user_id         VARCHAR(36)  FK → users.id    INDEX
├── challenge_id    VARCHAR(36)  FK → challenges.id  NULL
├── started_at      DATETIME
├── last_message_at DATETIME
└── total_tokens    INTEGER      DEFAULT 0

messages
├── id              VARCHAR(36)  PK
├── conversation_id VARCHAR(36)  FK → conversations.id  INDEX
├── role            VARCHAR(20)         ← "user" | "assistant"
├── content         TEXT
├── api_metadata    JSON         NULL   ← { input_tokens, output_tokens }
└── created_at      DATETIME
```

---

## 6. Tech Stack & Dependencies

### Backend (requirements.txt)
```
fastapi
uvicorn[standard]
sqlalchemy
alembic
aiosqlite                   ← dev (swap to asyncpg + PostgreSQL for prod)
python-jose[cryptography]   ← JWT tokens
passlib[bcrypt]             ← password hashing
anthropic                   ← official Python SDK
pydantic
pydantic-settings
python-dotenv
python-multipart
```

### Frontend (package.json)
```
react
react-dom
react-router-dom
```
Dev: `vite`, `@vitejs/plugin-react`

### Environment Variables (.env)
```
DATABASE_URL=sqlite+aiosqlite:///./seynse.db
SECRET_KEY=<random-64-char-hex>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
CORS_ORIGINS=http://localhost:5173
```

---

## 7. Vite Proxy (why the frontend can talk to the backend in dev)

In `vite.config.js`, the proxy setting forwards any `/api` request from the frontend dev server (port 5173) to the backend (port 8000). Without this, the browser blocks cross-origin requests.

```
Frontend (5173)  →  /api/challenges/  →  Vite proxy  →  Backend (8000)
```

In production, both are served from the same domain so no proxy is needed.

---

## 8. Build Order (what to implement and when)

```
1. backend/app/config.py           ← Load .env settings
2. backend/app/database.py         ← Engine, session, Base
3. backend/app/models/*.py         ← All 4 tables
4. backend/main.py                 ← Create app, register routers, CORS
5. backend/seed.py                 ← Populate challenges table
6. backend/app/services/auth_service.py    ← hash, verify, JWT create/verify
7. backend/app/middleware/auth.py          ← get_current_user dependency
8. backend/app/routes/auth.py              ← register, login, refresh, me
   ── TEST: can you register + login + call /me? ──
9. backend/app/routes/challenges.py        ← list, completions, complete, uncomplete
   ── TEST: can you list challenges + mark one done? ──
10. backend/app/services/coach.py          ← system prompt + Anthropic SDK call
11. backend/app/routes/conversations.py    ← start, list, get, send message
    ── TEST: can you start a conversation + send a message + get Aria's reply? ──
12. backend/app/routes/progress.py         ← summary, domains
13. frontend: swap Anthropic fetch → api.js calls to YOUR backend
14. frontend: add login/register screens
15. frontend: connect progress bars to /api/progress/domains
```

---

## 9. The One Rule

The frontend artifact (seynse.jsx) currently calls Anthropic directly:
```js
fetch("https://api.anthropic.com/v1/messages", ...)  // ← REMOVE THIS
```

Replace every API call with your backend:
```js
api.post("/api/conversations/", { challenge_id }, token)         // start chat
api.post(`/api/conversations/${id}/messages`, { content }, token) // send message
api.get("/api/challenges/", token)                                // list challenges
api.get("/api/challenges/completions", token)                     // get progress
api.post(`/api/challenges/${id}/complete`, { anxiety_before, anxiety_after }, token)
```

The backend handles Anthropic, auth, storage — the frontend is just UI.
