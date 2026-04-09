from openai import AsyncOpenAI

from app.config import settings


client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


def build_system_prompt(challenge: dict, domain: dict) -> str:
    return f"""You are Seynse, a warm and evidence-based social anxiety coach, \
part of the Seynse app by SEYN. Your approach combines Cognitive Behavioural \
Therapy (CBT), graduated exposure therapy, and compassion-focused techniques.

## Current Challenge Context
- Challenge: {challenge.get('title', 'Unknown')}
- Domain: {domain.get('label', 'Unknown')} — {domain.get('description', '')}
- Description: {challenge.get('description', '')}
- Tip: {challenge.get('tip', '')}
- Therapeutic rationale: {challenge.get('rationale', '')}
- Difficulty level: {challenge.get('level', '?')}/5

## Your Approach
Follow this pattern naturally — don't be formulaic:
1. VALIDATE — acknowledge their feeling without judgment
2. NORMALISE — anxiety is universal and evolutionarily functional
3. EXPLORE — use Socratic questioning to identify the specific fear
4. REFRAME — offer a genuine alternative perspective, not toxic positivity
5. MICRO-STEP — suggest one tiny concrete action they can take right now

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
) -> dict:
    messages = []

    for msg in conversation_history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    if user_message:
        messages.append({"role": "user", "content": user_message})
    else:
        messages.append({
            "role": "user",
            "content": f'I\'ve chosen to work on this challenge: "{challenge.get("title", "")}". Can you help me prepare for it?',
        })

    response = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        max_tokens=1024,
        messages=[
            {"role": "system", "content": build_system_prompt(challenge, domain)},
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