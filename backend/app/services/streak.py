"""
Streak tracking logic.

Pure function: given a user's streak state and today's date, compute
the update to apply when they complete a challenge.

Design notes:
- A streak is defined by consecutive calendar days with at least one completion.
- Multiple completions on the same day don't advance the streak — they all
  belong to the same day-of-streak.
- A single-day gap breaks the streak (resets to 1 on the next completion).
- last_completion_date uses DATE not DATETIME so time-of-day never affects streak logic.
"""

from dataclasses import dataclass
from datetime import date, timedelta


@dataclass
class StreakUpdate:
    current_streak: int         # to store on user.current_streak
    streak_day: int             # day-of-streak for THIS completion (→ completion.streak_day)
    is_new_personal_best: bool  # true if new current_streak exceeds longest_streak


def compute_streak_update(
    *,
    current_streak: int,
    longest_streak: int,
    last_completion_date: date | None,
    today: date,
) -> StreakUpdate:
    """Four cases:
    1. No prior completions: streak becomes 1.
    2. Same day as last completion: streak unchanged (repeat on day N).
    3. One calendar day later: streak += 1.
    4. More than one day gap (or clock-skew into the past): streak resets to 1.
    """
    if last_completion_date is None:
        new_streak = 1
    elif today == last_completion_date:
        new_streak = current_streak
    elif today == last_completion_date + timedelta(days=1):
        new_streak = current_streak + 1
    else:
        # Gap, or (defensively) today < last — reset rather than trust the past.
        new_streak = 1

    return StreakUpdate(
        current_streak=new_streak,
        streak_day=new_streak,
        is_new_personal_best=new_streak > longest_streak,
    )