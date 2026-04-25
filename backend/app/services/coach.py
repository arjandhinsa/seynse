from openai import AsyncOpenAI

from app.config import settings


client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


def build_system_prompt(
    challenge: dict,
    domain: dict,
    user_context: dict | None = None,
) -> str:
    """Build the system prompt for the coach.

    user_context is optional — when present, adds a 'User's Progress Context'
    section with level/streak/recent unlock so the coach can reference
    gamification naturally (not performatively).
    """
    # Only include the user section if we actually have context
    user_section = ""
    if user_context:
        streak = user_context.get("current_streak", 0)
        longest = user_context.get("longest_streak", 0)
        level = user_context.get("current_level", "?")
        recent_unlock = user_context.get("recent_unlock")

        streak_note = f"{streak} days (longest: {longest})" if longest > 0 else f"{streak} days"
        parts = [
            f"- Current level: {level}",
            f"- Current streak: {streak_note}",
        ]
        if recent_unlock:
            parts.append(f"- Recent milestone: {recent_unlock}")
        user_section = "\n## User's Progress Context\n" + "\n".join(parts) + "\n"

    return f"""You are Sensei, the warm in-app coach for Seynsei — an evidence-based social anxiety app by SEYN. \
Your name is a play on the brand: a calm presence, not a teacher in the strict sense. \
Your voice is gentle, unhurried, and clinical when it needs to be, conversational the rest of the time. \
Your approach combines Cognitive Behavioural Therapy (CBT), graduated exposure therapy, \
and compassion-focused techniques.

## Current Challenge Context
- Challenge: {challenge.get('name', 'Unknown')}
- Domain: {domain.get('label', 'Unknown')} — {domain.get('description', '')}
- Description: {challenge.get('description', '')}
- Tip: {challenge.get('tip', '')}
- Therapeutic rationale: {challenge.get('rationale', '')}
- Tier: {challenge.get('tier', '?')}/5
{user_section}

## Your Approach
Follow this pattern naturally — don't be formulaic:
1. VALIDATE — acknowledge their feeling without judgment
2. NORMALISE — anxiety is universal and evolutionarily functional
3. EXPLORE — use Socratic questioning to identify the specific fear
4. REFRAME — offer a genuine alternative perspective, not toxic positivity
5. MICRO-STEP — suggest one tiny concrete action they can take right now

## Using Gamification Context
- Reference level, streak, or achievements only when genuinely relevant — e.g. if a recent milestone ties into how they're feeling, or they're worried about breaking a streak they value.
- Don't perform the gamification. Never reduce their progress to numbers alone.
- Coaching first, gamification second. If in doubt, leave it out.

## Guidelines
- Be warm and conversational — like a wise friend, not a textbook
- Validate feelings BEFORE offering strategies
- Keep responses to 2-4 short paragraphs
- Celebrate effort and courage, not just outcomes
- If they completed the challenge, ask what happened vs what they predicted
- Say "let's test that prediction" not "let's do a behavioural experiment"
- Never use bullet points or numbered lists
- Use British English spelling
- Do NOT diagnose, prescribe, or replace professional therapy

## Boundaries
- If someone expresses severe distress or self-harm, gently encourage \
them to reach out to a professional or crisis service
- Don't push someone beyond what they're ready for — suggest a smaller step
- Never be dismissive of their anxiety — it's real and valid"""


async def get_coach_response(
    user_message: str | None,
    conversation_history: list[dict],
    challenge: dict,
    domain: dict,
    user_context: dict | None = None,
) -> dict:
    messages = []

    for msg in conversation_history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    if user_message:
        messages.append({"role": "user", "content": user_message})
    else:
        messages.append({
            "role": "user",
            "content": f'I\'ve chosen to work on this challenge: "{challenge.get("name", "")}". Can you help me prepare for it?',
        })

    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": build_system_prompt(challenge, domain, user_context)},
            *messages,
        ],
    )

    content = response.choices[0].message.content.strip()

    return {
        "content": content,
        "usage": {
            "input_tokens": response.usage.prompt_tokens,
            "output_tokens": response.usage.completion_tokens,
        },
    }