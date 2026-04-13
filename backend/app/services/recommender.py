import joblib
import numpy as np
import os

# Load models once on startup
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "ml")

domain_model = joblib.load(os.path.join(MODEL_DIR, "domain_model.pkl"))
level_model = joblib.load(os.path.join(MODEL_DIR, "level_model.pkl"))
feature_cols = joblib.load(os.path.join(MODEL_DIR, "feature_cols.pkl"))

DOMAINS = ["social", "professional", "romantic"]
DOMAIN_MAP = {0: "social", 1: "professional", 2: "romantic"}
DOMAIN_TO_INT = {"social": 0, "professional": 1, "romantic": 2}


def compute_user_features(completions: list[dict]) -> dict:
    """Compute features from a user's completion history."""
    if not completions:
        return None

    features = {}
    reductions = [c["anxiety_before"] - c["anxiety_after"] for c in completions if c["anxiety_before"] is not None]
    before_scores = [c["anxiety_before"] for c in completions if c["anxiety_before"] is not None]
    after_scores = [c["anxiety_after"] for c in completions if c["anxiety_after"] is not None]

    features["total_completed"] = len(completions)
    features["avg_reduction"] = np.mean(reductions) if reductions else 0
    features["avg_anxiety_before"] = np.mean(before_scores) if before_scores else 50
    features["avg_anxiety_after"] = np.mean(after_scores) if after_scores else 50
    features["engagement_rate"] = len([c for c in completions if c["anxiety_before"] is not None]) / max(len(completions), 1)

    for domain in DOMAINS:
        domain_data = [c for c in completions if c["domain"] == domain]
        domain_reductions = [c["anxiety_before"] - c["anxiety_after"] for c in domain_data if c["anxiety_before"] is not None]
        domain_before = [c["anxiety_before"] for c in domain_data if c["anxiety_before"] is not None]
        domain_levels = [c["level"] for c in domain_data]

        features[f"{domain}_completed"] = len(domain_data)
        features[f"{domain}_max_level"] = max(domain_levels) if domain_levels else 0
        features[f"{domain}_avg_reduction"] = np.mean(domain_reductions) if domain_reductions else 0
        features[f"{domain}_avg_anxiety"] = np.mean(domain_before) if domain_before else 50

    # Recent momentum — last 5
    recent = completions[-5:]
    recent_reductions = [c["anxiety_before"] - c["anxiety_after"] for c in recent if c["anxiety_before"] is not None]
    recent_engaged = [1 for c in recent if c["anxiety_before"] is not None]

    features["recent_avg_reduction"] = np.mean(recent_reductions) if recent_reductions else 0
    features["recent_engagement"] = len(recent_engaged) / max(len(recent), 1)
    features["recent_max_level"] = max([c["level"] for c in recent]) if recent else 0

    # Most avoided domain
    domain_counts = {d: features[f"{d}_completed"] for d in DOMAINS}
    features["most_avoided_domain"] = DOMAIN_TO_INT[min(domain_counts, key=domain_counts.get)]

    return features


def recommend_next_challenge(completions: list[dict]) -> dict:
    """Given a user's completion history, recommend the next challenge."""

    # Cold start — no history, recommend Level 1 Social
    if not completions or len(completions) < 2:
        return {
            "domain": "social",
            "level": 1,
            "reason": "Start with a gentle social challenge to build your foundation.",
        }

    features = compute_user_features(completions)
    if features is None:
        return {"domain": "social", "level": 1, "reason": "Start with a gentle social challenge."}

    # Build feature vector in correct order
    X = np.array([[features.get(col, 0) for col in feature_cols]])

    # Predict domain and level
    domain_pred = int(domain_model.predict(X)[0])
    level_pred = int(level_model.predict(X)[0])

    # Convert back
    recommended_domain = DOMAIN_MAP.get(domain_pred, "social")
    recommended_level = level_pred + 2  # Add back the offset from training

    # Clamp level
    recommended_level = max(1, min(5, recommended_level))

    # Generate reason
    domain_label = recommended_domain.title()
    max_level = features.get(f"{recommended_domain}_max_level", 0)
    avg_reduction = features.get(f"{recommended_domain}_avg_reduction", 0)

    if features[f"{recommended_domain}_completed"] == 0:
        reason = f"You haven't tried any {domain_label} challenges yet. Time to explore this area."
    elif recommended_level > max_level:
        reason = f"You're showing strong progress in {domain_label} (avg {avg_reduction:.0f} point anxiety reduction). Ready to step up to Level {recommended_level}."
    else:
        reason = f"Keep building confidence in {domain_label} at Level {recommended_level}. Consistency is where real progress happens."

    return {
        "domain": recommended_domain,
        "level": recommended_level,
        "reason": reason,
    }