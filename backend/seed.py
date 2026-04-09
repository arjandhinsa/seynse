import asyncio
from app.database import engine, Base, SessionLocal
from app.models.challenge import Challenge
import app.models.user  # noqa: F401 — ensures User is registered in SQLAlchemy's mapper before any query runs
import app.models.conversation  # noqa: F401 — same reason


# All 27 challenges — 9 per domain, levels 1-5
SEED_DATA = {
    "social": [
        {"level": 1, "title": "Smile at a stranger", "description": "Make brief eye contact and smile at someone you pass today. No words needed.", "tip": "Start in a low-pressure place like a park or quiet shop.", "rationale": "Targets eye contact avoidance — a common safety behaviour."},
        {"level": 1, "title": "Say hello to a neighbour", "description": "Next time you see a neighbour, say 'hi' or 'morning'. Keep walking — no conversation required.", "tip": "A small wave counts too if words feel like too much.", "rationale": "Practises initiating micro-interactions without the fear of being trapped in conversation."},
        {"level": 2, "title": "Compliment a barista or cashier", "description": "Say something simple like 'Love this place' or 'Thanks, have a great day' with genuine warmth.", "tip": "They hear hundreds of people a day — there's zero judgment here.", "rationale": "Introduces voluntary positive interaction within a safe transactional context."},
        {"level": 2, "title": "Ask someone for directions", "description": "Even if you know the way, ask a stranger for directions to somewhere nearby.", "tip": "This is a low-stakes practice — you'll never see them again.", "rationale": "A behavioural experiment: tests the prediction that people will think you're annoying."},
        {"level": 3, "title": "Make small talk in a queue", "description": "Comment on something shared — the weather, the wait, the music playing. Just one line.", "tip": "People in queues are usually bored and welcome a brief chat.", "rationale": "Requires generating conversation from nothing — a key fear in social anxiety."},
        {"level": 3, "title": "Join a group class or meetup", "description": "Attend a fitness class, art workshop, or community event. You don't need to talk to everyone — just show up.", "tip": "Having a shared activity removes the pressure to perform socially.", "rationale": "Targets avoidance of group settings. Shared activity reduces cognitive load."},
        {"level": 4, "title": "Start a conversation with someone new", "description": "At a cafe, gym, or event — introduce yourself to someone and chat for 2+ minutes.", "tip": "Ask open-ended questions. People love talking about themselves.", "rationale": "Full social initiation without a transactional excuse. Tests the core fear of not being interesting enough."},
        {"level": 4, "title": "Organise a small gathering", "description": "Invite 2-3 people for coffee, a walk, or a casual meal. You set the time and place.", "tip": "Being the organiser actually gives you more control, which can reduce anxiety.", "rationale": "Shifts from reactive to proactive social role."},
        {"level": 5, "title": "Share something vulnerable", "description": "Tell a friend or acquaintance something real about how you're feeling. Be honest about a struggle.", "tip": "Vulnerability builds deeper connections. Most people respond with warmth.", "rationale": "Emotional exposure — challenges the belief that if people really knew you, they would reject you."},
    ],
    "professional": [
        {"level": 1, "title": "Update your LinkedIn headline", "description": "Spend 10 minutes refreshing your profile. Small action, big psychological shift.", "tip": "You don't need the perfect headline — just something current.", "rationale": "Behavioural activation — a small action that breaks the avoidance cycle."},
        {"level": 1, "title": "Practise your intro in a mirror", "description": "Say 'Hi, I'm [name], I [what you do]' out loud 5 times. Get comfortable hearing your own voice.", "tip": "Record yourself once — you'll sound better than you think.", "rationale": "Repeated practice reduces the novelty-anxiety response to self-presentation."},
        {"level": 2, "title": "Send a LinkedIn connection request", "description": "Connect with someone in your field with a brief personal note. One sentence is enough.", "tip": "Mention something specific — a post they wrote, a shared interest.", "rationale": "Low-stakes digital initiation. Tests the fear of being ignored or seen as presumptuous."},
        {"level": 2, "title": "Ask a question in an online forum", "description": "Post a genuine question in a professional community, Slack group, or subreddit.", "tip": "Online interactions are great training wheels for in-person ones.", "rationale": "Practises putting yourself out there with the buffer of text-based communication."},
        {"level": 3, "title": "Email someone you admire", "description": "Send a short, genuine message to someone in your industry. Thank them for their work or ask one question.", "tip": "Keep it under 4 sentences. Busy people appreciate brevity.", "rationale": "Direct outreach to a perceived higher-status person — challenges hierarchical anxiety."},
        {"level": 3, "title": "Do a mock interview", "description": "Ask a friend or use a mirror. Practise answering 'Tell me about yourself' and 'Why this role?'", "tip": "Stumbling in practice means you won't stumble when it counts.", "rationale": "Exposure to the interview format reduces the fear of freezing."},
        {"level": 4, "title": "Attend a networking event", "description": "Go to a meetup, conference, or career fair. Goal: have 2 genuine conversations.", "tip": "Arrive early — it's easier to talk to people when the room is less full.", "rationale": "High-stimulus social environment with a specific achievable goal."},
        {"level": 4, "title": "Negotiate something small", "description": "Ask for a better price, a deadline extension, or a different meeting time. Practise advocating for yourself.", "tip": "The worst they can say is no. And that's completely fine.", "rationale": "Assertiveness training — targets the people-pleasing pattern common in social anxiety."},
        {"level": 5, "title": "Apply for a stretch role", "description": "Apply for a position that feels slightly beyond your current level. Write the cover letter with confidence.", "tip": "Job specs are wishlists, not checklists.", "rationale": "Confronts impostor syndrome directly. The act of applying is the exposure."},
    ],
    "romantic": [
        {"level": 1, "title": "Maintain eye contact a beat longer", "description": "When talking to someone you find attractive, hold eye contact for one extra second before looking away.", "tip": "This is about comfort with presence, not intensity.", "rationale": "Micro-exposure to intimacy signals. Eye contact avoidance is one of the strongest safety behaviours."},
        {"level": 1, "title": "Give a genuine compliment", "description": "Tell someone you find attractive something specific you appreciate — their style, energy, or something they said.", "tip": "Compliment choices, not bodies. 'Great jacket' beats physical comments.", "rationale": "Practises expressing positive regard without expectation of reciprocation."},
        {"level": 2, "title": "Start a friendly chat", "description": "Talk to someone you're drawn to with zero agenda. Just be curious about them as a person.", "tip": "Removing the outcome pressure makes you naturally more relaxed.", "rationale": "Decouples attraction from performance anxiety."},
        {"level": 2, "title": "Join a social hobby", "description": "Sign up for something social — a dance class, book club, cooking course. Meet people organically.", "tip": "Shared interests create natural conversation starters.", "rationale": "Creates repeated-exposure opportunities in a low-pressure environment."},
        {"level": 3, "title": "Express interest directly", "description": "Tell someone you've enjoyed talking to them and would like to continue the conversation sometime.", "tip": "Being direct is refreshing. Most people respect honesty even if the feeling isn't mutual.", "rationale": "Moves from passive hoping to active expression — the core shift for romantic confidence."},
        {"level": 3, "title": "Set up a dating profile", "description": "Create or refresh a profile. Choose photos you genuinely like. Write something authentic.", "tip": "Authenticity stands out more than trying to seem impressive.", "rationale": "Self-presentation exposure in a structured, controllable format."},
        {"level": 4, "title": "Ask someone on a low-key date", "description": "Suggest coffee, a walk, or an activity you both enjoy. Keep it casual and low-pressure.", "tip": "Framing it as 'let's grab coffee' feels lighter than 'can I take you out'.", "rationale": "The classic feared situation. Casual framing controls the exposure intensity."},
        {"level": 4, "title": "Be honest about your feelings", "description": "If you're enjoying getting to know someone, tell them. Don't play it cool if that's not how you feel.", "tip": "Emotional honesty is a strength, not a weakness.", "rationale": "Drops the mask — challenges the belief that your authentic self isn't enough."},
        {"level": 5, "title": "Handle rejection gracefully", "description": "If someone isn't interested, respond with kindness. Thank them for their honesty and move forward.", "tip": "Rejection is redirection. Every 'no' gets you closer to the right 'yes'.", "rationale": "The ultimate exposure: facing the feared outcome and surviving it."},
    ],
}


async def seed_challenges():
    async with SessionLocal() as session:
        # Check if already seeded — safe to run multiple times
        from sqlalchemy import select, func
        result = await session.execute(select(func.count(Challenge.id)))
        existing = result.scalar() or 0

        if existing > 0:
            print(f"Already seeded ({existing} challenges). Delete seynse.db to re-seed.")
            return

        order = 0
        for domain, challenges in SEED_DATA.items():
            for c in challenges:
                session.add(Challenge(
                    domain=domain,
                    title=c["title"],
                    description=c["description"],
                    tip=c["tip"],
                    rationale=c["rationale"],
                    level=c["level"],
                    sort_order=order,
                ))
                order += 1

        await session.commit()
        print(f"Seeded {order} challenges across {len(SEED_DATA)} domains")


async def main():
    # Create tables then seed
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_challenges()


if __name__ == "__main__":
    asyncio.run(main())