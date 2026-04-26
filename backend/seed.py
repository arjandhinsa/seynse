"""
Seed script for Seynsei's gamified v1.

Populates the database with:
- 18 challenges (9 Social + 9 Dating, across 5 tiers)
- 18 achievements (first-time milestones, volume, streaks, XP, repetition, balance)

Usage:
  python seed.py              # seed only if tables are empty (safe to re-run)
  python seed.py --wipe       # DESTRUCTIVE (DEV ONLY): drop all tables, run
                              # `alembic upgrade head`, reseed catalogue.
"""
import argparse
import asyncio
import subprocess

from sqlalchemy import select, func, text

from app.database import engine, Base, SessionLocal
# Importing from app.models triggers models/__init__.py, which imports every
# model class — so SQLAlchemy's mapper is fully configured before we seed.
from app.models import Achievement, Challenge


# Tier → default XP value. Stored per-challenge on Challenge.xp_value so
# individual challenges can be tuned later without being locked to the
# tier default. The seed uses this map as the source of truth.
TIER_XP = {1: 1, 2: 5, 3: 15, 4: 50, 5: 100}


# ============================================================================
# CHALLENGES — 18 total, 9 per domain, distribution 2/2/2/2/1 per tier.
# ============================================================================
SEED_CHALLENGES = {
    "social": [
        # --- Tier 1: Presence ---
        {
            "tier": 1,
            "name": "Hold eye contact for three seconds",
            "description": "When you pass someone or speak to a cashier, hold eye contact for a full three-Mississippi before looking away.",
            "tip": "A quick glance and nod counts if three seconds feels too long today.",
            "rationale": "Eye contact avoidance is one of the most reinforced safety behaviours in social anxiety. Holding contact without escape collects evidence that nothing bad happens.",
            "safety_behaviour_targeted": "Breaking eye contact the moment it registers",
            "cognitive_distortion_challenged": "Assuming they must be judging me",
        },
        {
            "tier": 1,
            "name": "Smile at someone you pass",
            "description": "Deliberately smile at someone you cross paths with today — just a small, brief smile. Keep walking.",
            "tip": "A half-smile at someone who already looks friendly is a perfect start.",
            "rationale": "Introduces a positive signal without commitment to conversation. Builds a felt sense that strangers are, on the whole, safe.",
            "safety_behaviour_targeted": "Keeping a neutral or closed face in public",
            "cognitive_distortion_challenged": "Assuming they'll think I'm weird",
        },
        # --- Tier 2: Scripted ---
        {
            "tier": 2,
            "name": "Order something and ask one follow-up question",
            "description": "Order at a café or shop and ask one follow-up — what's in it, which is their favourite, anything real.",
            "tip": "Any genuine question works. 'What do you recommend' is always valid.",
            "rationale": "Pushes past the rehearsed transaction into a tiny real exchange. Low-stakes and high-frequency training.",
            "safety_behaviour_targeted": "Rehearsing the exact order to avoid improvisation",
            "cognitive_distortion_challenged": "Worrying I'll sound stupid if I ad-lib",
        },
        {
            "tier": 2,
            "name": "Compliment a staff member genuinely",
            "description": "Tell someone serving you something real — 'great playlist', 'love this place', 'you made my day'. Mean it.",
            "tip": "One sentence is enough. You don't have to wait for a reply.",
            "rationale": "Practises warmth in a setting where the other person is professionally receptive. Low rejection risk, real expression.",
            "safety_behaviour_targeted": "Nodding and leaving without speaking beyond the transaction",
            "cognitive_distortion_challenged": "Thinking my positivity will sound hollow",
        },
        # --- Tier 3: Unscripted ---
        {
            "tier": 3,
            "name": "Start a two-line exchange in a queue",
            "description": "While waiting, say one line to the person next to you — about the wait, the weather, the place. Let it end if it ends.",
            "tip": "If they give a one-word reply and turn away, you still did the challenge.",
            "rationale": "Generating conversation without an agenda is the core feared skill. Accepting that it can just end disarms the pressure.",
            "safety_behaviour_targeted": "Pretending to check your phone to avoid initiating",
            "cognitive_distortion_challenged": "Believing awkward silence equals disaster",
        },
        {
            "tier": 3,
            "name": "Show up to a group activity",
            "description": "Sign up for and attend one class, meetup, or club you've been avoiding. Goal: stay the full session.",
            "tip": "You can leave early. Just arriving counts for today.",
            "rationale": "Shared-activity settings reduce the cognitive load of socialising — the activity is the structure. Exposure without direct social demand.",
            "safety_behaviour_targeted": "Avoiding group settings where interaction can't be controlled",
            "cognitive_distortion_challenged": "Thinking if I can't be perfectly social, I shouldn't go",
        },
        # --- Tier 4: Initiation with stake ---
        {
            "tier": 4,
            "name": "Start a conversation with someone new",
            "description": "At a café, gym, or event, introduce yourself to someone and chat for at least two minutes. No transactional excuse.",
            "tip": "If the conversation stalls naturally after 90 seconds, that still counts.",
            "rationale": "Full social initiation without a transactional excuse. Tests the core fear of not being interesting enough.",
            "safety_behaviour_targeted": "Staying silent until someone else speaks first",
            "cognitive_distortion_challenged": "Thinking I'm boring and won't have anything to say if I start talking",
        },
        {
            "tier": 4,
            "name": "Organise a small gathering",
            "description": "Invite two or three people for coffee, a walk, or a casual meal. You set the time and place.",
            "tip": "One person counts. Even one person you organised something with is a completion.",
            "rationale": "Shifts from reactive to proactive social role. Being the organiser actually gives you more control, which can reduce anxiety.",
            "safety_behaviour_targeted": "Waiting for others to initiate plans",
            "cognitive_distortion_challenged": "Thinking no one wants to spend time with me",
        },
        # --- Tier 5: Vulnerability ---
        {
            "tier": 5,
            "name": "Share something real with a friend",
            "description": "Tell someone you trust about a struggle or feeling you've been carrying. Not solution-seeking — just 'this has been happening'.",
            "tip": "Start small. One sentence of honesty about something minor is a complete challenge.",
            "rationale": "Emotional exposure. Challenges the core belief that authentic self equals rejection. Vulnerability consistently deepens rather than damages relationships.",
            "safety_behaviour_targeted": "Keeping conversations surface-level",
            "cognitive_distortion_challenged": "Believing if people really knew me, they'd leave",
        },
    ],
    "dating": [
        # --- Tier 1: Presence ---
        {
            "tier": 1,
            "name": "Hold eye contact with someone you find attractive",
            "description": "When you see someone you find attractive, hold eye contact for a full three-Mississippi before looking away.",
            "tip": "You can look away and back — three seconds total across two glances still counts.",
            "rationale": "Desensitises the intimacy-adjacent freeze response. Attraction-triggered look-away is a learnable override.",
            "safety_behaviour_targeted": "Looking away the instant attraction registers",
            "cognitive_distortion_challenged": "Assuming they'll think I'm creepy for holding it",
        },
        {
            "tier": 1,
            "name": "Smile at someone you're drawn to",
            "description": "When you make eye contact with someone you find attractive, smile briefly. No follow-up required.",
            "tip": "A soft smile counts. It doesn't need to be beaming.",
            "rationale": "Practises expressing positive regard with zero agenda. Decouples attraction from pursuit.",
            "safety_behaviour_targeted": "Maintaining a blank face to avoid revealing interest",
            "cognitive_distortion_challenged": "Assuming they'll be weirded out",
        },
        # --- Tier 2: Scripted ---
        {
            "tier": 2,
            "name": "Start a friendly chat with no agenda",
            "description": "Talk to someone you're drawn to with zero agenda. Just be curious about them as a person.",
            "tip": "Let it be short. Three sentences each and a natural exit is a win.",
            "rationale": "Decouples attraction from performance anxiety. Removing outcome pressure makes you naturally more relaxed.",
            "safety_behaviour_targeted": "Avoiding any conversation with people you find attractive",
            "cognitive_distortion_challenged": "Believing any conversation has to lead somewhere",
        },
        {
            "tier": 2,
            "name": "Compliment their style or energy",
            "description": "Tell someone you're drawn to something specific you appreciate — their style, their energy, something they said. Not about their looks.",
            "tip": "One line is enough. 'I like your energy' or 'that's a great jacket' both work.",
            "rationale": "Practises expressing positive regard observationally rather than objectifying. The 'not their looks' rule lowers your fear of being misread.",
            "safety_behaviour_targeted": "Only saying generic neutral things to avoid specifics",
            "cognitive_distortion_challenged": "Thinking it has to be clever",
        },
        # --- Tier 3: Unscripted, escalation ---
        {
            "tier": 3,
            "name": "Express direct interest in continuing to talk",
            "description": "Tell someone you've enjoyed talking to that you'd like to continue the conversation sometime.",
            "tip": "Exact words matter less than intent. 'This was nice, we should do it again' works.",
            "rationale": "Moves from passive hoping to active expression — the core shift for romantic confidence.",
            "safety_behaviour_targeted": "Hoping the other person will signal first",
            "cognitive_distortion_challenged": "Assuming if they wanted to, they'd say so",
        },
        {
            "tier": 3,
            "name": "Keep a conversation past ten minutes with someone you're drawn to",
            "description": "Stay in a conversation with someone you're attracted to past the point your anxiety wants to exit. Notice the pull to bail and stay anyway.",
            "tip": "If they wrap up at 8 minutes, that was them, not you. You still exposed yourself to the stay.",
            "rationale": "Social anxiety wants to exit the moment mutual interest becomes visible. Staying past that reflex is the exposure.",
            "safety_behaviour_targeted": "Making an excuse to end the conversation when heat registers",
            "cognitive_distortion_challenged": "Fearing they'll be uninterested if I stay too long",
        },
        # --- Tier 4: Initiation with stake ---
        {
            "tier": 4,
            "name": "Ask for someone's number",
            "description": "Ask someone you've been talking to for their number. Clear, simple, no qualifiers.",
            "tip": "If they decline, you still completed the challenge — the asking is the exposure, not the outcome.",
            "rationale": "A concrete ask with an outcome, but lower-stake than proposing plans. The ask itself is the exposure.",
            "safety_behaviour_targeted": "Waiting for them to offer their number first",
            "cognitive_distortion_challenged": "Assuming they'll say no",
        },
        {
            "tier": 4,
            "name": "Ask someone on a low-key date",
            "description": "Suggest coffee, a walk, or a specific activity you both enjoy. Keep it casual, but commit to a time and place.",
            "tip": "Specific is easier. 'Coffee Saturday afternoon' beats 'sometime'.",
            "rationale": "Proposes real logistics and an implicit time commitment. Follows naturally from having asked for their number.",
            "safety_behaviour_targeted": "Keeping things vague to avoid a real ask",
            "cognitive_distortion_challenged": "Believing if they say no I'll be humiliated",
        },
        # --- Tier 5: Vulnerability ---
        {
            "tier": 5,
            "name": "Handle rejection with grace",
            "description": "If someone isn't interested, respond with kindness. Thank them for their honesty and move forward without withdrawing bitterly.",
            "tip": "One kind line is enough. 'Thanks for being honest — take care.'",
            "rationale": "The ultimate exposure: facing the feared outcome and surviving it. Your win condition is how you respond, not the outcome itself.",
            "safety_behaviour_targeted": "Avoiding any situation where rejection is possible",
            "cognitive_distortion_challenged": "Taking their rejection as proof I'm unworthy",
        },
    ],
}


# ============================================================================
# ACHIEVEMENTS — 18 total across 6 categories.
# ============================================================================
SEED_ACHIEVEMENTS = [
    # First-time tier milestones
    {"code": "first_step",    "name": "First Step",            "description": "Your first completion ever.",           "icon": "🌱",  "condition_type": "total_completions",      "condition_value": 1,   "xp_bonus": 10},
    {"code": "first_tier_2",  "name": "Into the Conversation", "description": "First Tier 2 challenge completed.",     "icon": "💬",  "condition_type": "tier_reached",           "condition_value": 2,   "xp_bonus": 10},
    {"code": "first_tier_3",  "name": "Off-Script",            "description": "First Tier 3 challenge completed.",     "icon": "✨",  "condition_type": "tier_reached",           "condition_value": 3,   "xp_bonus": 25},
    {"code": "first_tier_4",  "name": "Skin in the Game",      "description": "First Tier 4 challenge completed.",     "icon": "⚡",  "condition_type": "tier_reached",           "condition_value": 4,   "xp_bonus": 75},
    {"code": "first_tier_5",  "name": "Vulnerable",            "description": "First Tier 5 challenge completed.",     "icon": "🏆",  "condition_type": "tier_reached",           "condition_value": 5,   "xp_bonus": 150},
    # Volume
    {"code": "completions_5",   "name": "Getting Started", "description": "Complete 5 challenges.",   "icon": "🎯",  "condition_type": "total_completions", "condition_value": 5,   "xp_bonus": 20},
    {"code": "completions_25",  "name": "Committed",       "description": "Complete 25 challenges.",  "icon": "🔨",  "condition_type": "total_completions", "condition_value": 25,  "xp_bonus": 50},
    {"code": "completions_100", "name": "Century Club",    "description": "Complete 100 challenges.", "icon": "💯",  "condition_type": "total_completions", "condition_value": 100, "xp_bonus": 200},
    # Streaks
    {"code": "streak_2",  "name": "Back Again",         "description": "Two days in a row.",   "icon": "🔥",  "condition_type": "streak_days", "condition_value": 2,  "xp_bonus": 10},
    {"code": "streak_7",  "name": "Building Momentum",  "description": "Seven-day streak.",    "icon": "🔥",  "condition_type": "streak_days", "condition_value": 7,  "xp_bonus": 50},
    {"code": "streak_30", "name": "On Fire",            "description": "Thirty-day streak.",   "icon": "🔥",  "condition_type": "streak_days", "condition_value": 30, "xp_bonus": 200},
    # Level / XP milestones — no xp_bonus because the level-up itself is the reward
    {"code": "xp_100",  "name": "Level 2", "description": "Reach 100 total XP.",  "icon": "🥉",  "condition_type": "xp_milestone", "condition_value": 100,  "xp_bonus": 0},
    {"code": "xp_400",  "name": "Level 3", "description": "Reach 400 total XP.",  "icon": "🥈",  "condition_type": "xp_milestone", "condition_value": 400,  "xp_bonus": 0},
    {"code": "xp_1000", "name": "Level 4", "description": "Reach 1000 total XP.", "icon": "🥇",  "condition_type": "xp_milestone", "condition_value": 1000, "xp_bonus": 0},
    {"code": "xp_2000", "name": "Level 5", "description": "Reach 2000 total XP.", "icon": "💎",  "condition_type": "xp_milestone", "condition_value": 2000, "xp_bonus": 0},
    # Repetition — rewards habituation on a single challenge
    {"code": "repeat_10", "name": "10 of a Kind", "description": "Repeat one challenge 10 times.", "icon": "🔁", "condition_type": "challenge_repeat_count", "condition_value": 10, "xp_bonus": 30},
    {"code": "repeat_25", "name": "Habit Formed", "description": "Repeat one challenge 25 times.", "icon": "🌀", "condition_type": "challenge_repeat_count", "condition_value": 25, "xp_bonus": 100},
    # Balance — rewards cross-domain practice
    {"code": "balanced_10", "name": "Balanced", "description": "At least 10 completions in each domain.", "icon": "⚖️", "condition_type": "domain_balance", "condition_value": 10, "xp_bonus": 50},
]


# ============================================================================
# Database operations
# ============================================================================
async def wipe_all():
    """Drop every table, run alembic upgrade head, then reseed.
    DESTRUCTIVE. Only run in dev, or when cutting over to a fresh database."""
    print("[seed --wipe] DESTRUCTIVE — only run in dev. "
          "Drops all tables, recreates via alembic, reseeds catalogue.")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        # Drop alembic_version too — otherwise upgrade head is a no-op
        # because alembic still thinks it's at head.
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version"))
    # Subprocess so alembic owns schema creation end-to-end (same path as prod).
    subprocess.run(["alembic", "upgrade", "head"], check=True)
    print("Database wiped and recreated via alembic.")


async def seed_challenges(session):
    """Insert the master challenge catalog. Skips if challenges already exist."""
    result = await session.execute(select(func.count(Challenge.id)))
    existing = result.scalar() or 0
    if existing > 0:
        print(f"Skipping challenges — already seeded ({existing} rows).")
        return 0

    order = 0
    for domain, challenges in SEED_CHALLENGES.items():
        for c in challenges:
            session.add(Challenge(
                domain=domain,
                tier=c["tier"],
                name=c["name"],
                description=c["description"],
                tip=c.get("tip"),
                rationale=c.get("rationale"),
                safety_behaviour_targeted=c.get("safety_behaviour_targeted"),
                cognitive_distortion_challenged=c.get("cognitive_distortion_challenged"),
                xp_value=TIER_XP[c["tier"]],
                sort_order=order,
            ))
            order += 1
    await session.commit()
    print(f"Seeded {order} challenges across {len(SEED_CHALLENGES)} domains.")
    return order


async def seed_achievements(session):
    """Insert the achievements catalog. Skips if achievements already exist."""
    result = await session.execute(select(func.count(Achievement.id)))
    existing = result.scalar() or 0
    if existing > 0:
        print(f"Skipping achievements — already seeded ({existing} rows).")
        return 0

    for a in SEED_ACHIEVEMENTS:
        session.add(Achievement(**a))
    await session.commit()
    print(f"Seeded {len(SEED_ACHIEVEMENTS)} achievements.")
    return len(SEED_ACHIEVEMENTS)


async def main(wipe: bool):
    if wipe:
        await wipe_all()
    # Non-wipe path assumes the schema already exists. On a fresh checkout
    # run `alembic upgrade head` first, then `python seed.py`. The seed
    # functions skip if catalogue rows are already present.
    async with SessionLocal() as session:
        await seed_challenges(session)
        await seed_achievements(session)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the Seynsei database.")
    parser.add_argument(
        "--wipe",
        action="store_true",
        help="Drop and recreate all tables before seeding. Destroys user data.",
    )
    args = parser.parse_args()
    asyncio.run(main(wipe=args.wipe))