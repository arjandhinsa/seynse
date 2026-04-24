"""
Recommender service (Phase 3 stub).

Rule-based stub that picks the underserved domain and recommends at the
user's current tier, preferring challenges they've done least often.

NOT an ML model. Phase 4 will replace this with a two-layer system:
- Rules (here) do the clinical gating: domain balance, tier progression.
- XGBoost picks the specific challenge within what the rules allow.

The stub keeps the frontend working with something defensible until then.

Rules, in order:
1. Cold start (0 completions): first Tier-1 Social challenge.
2. Pick the domain with fewer completions (tie → Social).
3. Tier = max_tier completed in that domain, or 1 if user has never touched it.
   Stub never pushes the user up a tier — that requires SUDS evidence (Phase 4).
4. Among candidates at that domain+tier, pick the one the user has completed
   least often. Tie → lowest sort_order.
"""

from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Challenge, ChallengeCompletion, User


# Tuple order matters: first entry is the tie-break winner for domain selection.
DOMAIN_PRIORITY = ("social", "dating")

# Short display names for the reason string (full labels live in progress_service).
DOMAIN_DISPLAY = {
    "social": "Social",
    "dating": "Dating",
}


class Recommendation(BaseModel):
    challenge_id: str
    name: str
    domain: str
    tier: int
    reason: str


async def recommend_next(user: User, session: AsyncSession) -> Recommendation | None:
    """Return the next-challenge recommendation. None if no challenges exist at all."""

    # Count completions per domain. Pre-populate zeros for domains the user
    # hasn't touched so the tie-break still works.
    domain_counts: dict[str, int] = {d: 0 for d in DOMAIN_PRIORITY}
    rows = (await session.execute(
        select(Challenge.domain, func.count(ChallengeCompletion.id))
        .join(ChallengeCompletion, Challenge.id == ChallengeCompletion.challenge_id)
        .where(ChallengeCompletion.user_id == user.id)
        .group_by(Challenge.domain)
    )).all()
    for domain, count in rows:
        if domain in domain_counts:
            domain_counts[domain] = count

    total = sum(domain_counts.values())

    # --- Rule 1: cold start ---
    if total == 0:
        first = (await session.execute(
            select(Challenge)
            .where(Challenge.domain == "social", Challenge.tier == 1)
            .order_by(Challenge.sort_order)
            .limit(1)
        )).scalar_one_or_none()
        if first is None:
            return None
        return Recommendation(
            challenge_id=first.id,
            name=first.name,
            domain=first.domain,
            tier=first.tier,
            reason="Welcome — let's start with a gentle Social challenge.",
        )

    # --- Rule 2: underserved domain. min() over DOMAIN_PRIORITY keeps the
    # tie-break deterministic (Social wins ties because it comes first). ---
    target_domain = min(DOMAIN_PRIORITY, key=lambda d: domain_counts[d])

    # --- Rule 3: tier = max completed in target domain, or 1 if untouched ---
    max_tier = (await session.execute(
        select(func.max(Challenge.tier))
        .join(ChallengeCompletion, Challenge.id == ChallengeCompletion.challenge_id)
        .where(
            ChallengeCompletion.user_id == user.id,
            Challenge.domain == target_domain,
        )
    )).scalar()
    target_tier = max_tier or 1

    # --- Rule 4: candidates at that domain+tier, ranked by completion count ---
    candidates = (await session.execute(
        select(Challenge)
        .where(Challenge.domain == target_domain, Challenge.tier == target_tier)
        .order_by(Challenge.sort_order)
    )).scalars().all()
    if not candidates:
        return None

    # How many times has the user done each candidate?
    counts: dict[str, int] = {c.id: 0 for c in candidates}
    rows = (await session.execute(
        select(ChallengeCompletion.challenge_id, func.count(ChallengeCompletion.id))
        .where(
            ChallengeCompletion.user_id == user.id,
            ChallengeCompletion.challenge_id.in_([c.id for c in candidates]),
        )
        .group_by(ChallengeCompletion.challenge_id)
    )).all()
    for cid, count in rows:
        counts[cid] = count

    # Pick least-completed; ties broken by sort_order (preserved by the query above).
    best = min(candidates, key=lambda c: counts[c.id])

    return Recommendation(
        challenge_id=best.id,
        name=best.name,
        domain=best.domain,
        tier=best.tier,
        reason=_build_reason(target_domain, target_tier, domain_counts),
    )


def _build_reason(target_domain: str, target_tier: int, domain_counts: dict[str, int]) -> str:
    """Generate the user-facing explanation for the recommendation."""
    other = "dating" if target_domain == "social" else "social"
    target_name = DOMAIN_DISPLAY[target_domain]

    if domain_counts[target_domain] < domain_counts[other]:
        other_name = DOMAIN_DISPLAY[other]
        return f"You've been focusing on {other_name}. Let's practise a {target_name} challenge."
    return (
        f"Keep building confidence in {target_name} at Tier {target_tier}. "
        "Consistency is where real progress happens."
    )