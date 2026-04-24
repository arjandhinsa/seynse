"""
XP calculation and level derivation.

Pure functions only — no DB access. Call from the completion orchestrator.

Design decisions:
- Level is derived from total XP, not stored on the user. Single source of truth.
- XP thresholds are hardcoded for L1-L10. Beyond L10, each level is +5000 XP.
- Streak multiplier applies to the tier's base XP; final xp_earned is stored
  on the completion row so historical values don't shift if we retune later.
"""

import bisect


# XP required to reach the START of each level.
# L1 starts at 0, L2 at 100, L3 at 400, L4 at 1000, L5 at 2000,
# L6 at 4000, L7 at 6000, L8 at 8000, L9 at 10000, L10 at 12000.
LEVEL_THRESHOLDS = [0, 100, 400, 1000, 2000, 4000, 6000, 8000, 10000, 12000]

# Beyond the explicit table (L10+), each additional level costs this many XP.
BEYOND_TABLE_INCREMENT = 5000


def level_for_xp(xp: int) -> int:
    """Return the current level given total XP. Always >= 1."""
    xp = max(0, xp)
    level = bisect.bisect_right(LEVEL_THRESHOLDS, xp)
    if level == len(LEVEL_THRESHOLDS):
        # Past the explicit table — extend linearly
        levels_beyond = (xp - LEVEL_THRESHOLDS[-1]) // BEYOND_TABLE_INCREMENT
        return level + levels_beyond
    return level


def xp_for_level(level: int) -> int:
    """Return the minimum XP to BE at this level (lower bound of its XP range)."""
    if level < 1:
        return 0
    idx = level - 1
    if idx < len(LEVEL_THRESHOLDS):
        return LEVEL_THRESHOLDS[idx]
    # Beyond the table
    extra_levels = idx - (len(LEVEL_THRESHOLDS) - 1)
    return LEVEL_THRESHOLDS[-1] + extra_levels * BEYOND_TABLE_INCREMENT


def level_progress(xp: int) -> dict:
    """Progress breakdown for the XP bar UI.

    Example: at 150 XP the user is Level 2 (100-400), so:
        xp_in_level        = 50     (150 - 100)
        xp_needed_for_level = 300   (400 - 100)
        xp_to_next_level   = 250    (400 - 150)
    """
    xp = max(0, xp)
    level = level_for_xp(xp)
    lower = xp_for_level(level)
    upper = xp_for_level(level + 1)
    return {
        "current_level": level,
        "xp_in_level": xp - lower,
        "xp_needed_for_level": upper - lower,
        "xp_to_next_level": upper - xp,
    }


def streak_multiplier(streak_day: int) -> float:
    """XP multiplier based on how deep into a streak this completion is.

    Per handoff spec: 1.5× on day 3+, 2× on day 7+.
    """
    if streak_day >= 7:
        return 2.0
    if streak_day >= 3:
        return 1.5
    return 1.0


def xp_for_completion(base_xp: int, streak_day: int) -> int:
    """XP earned for a single completion. Rounds down to int.

    Note: a Tier-1 challenge (1 XP) on a 1.5× day still earns 1 because
    int(1.5) == 1. The streak bonus is only meaningful for Tier 2+.
    """
    return int(base_xp * streak_multiplier(streak_day))