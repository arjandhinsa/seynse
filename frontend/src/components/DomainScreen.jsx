import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { api } from "../services/api";

const DOMAINS = {
  social: { label: "Everyday Social", icon: "👋", color: "#5B8C5A", accent: "#78b577" },
  professional: { label: "Career & Professional", icon: "💼", color: "#4A6FA5", accent: "#6b93cc" },
  romantic: { label: "Dating & Connection", icon: "💜", color: "#8B5E83", accent: "#b07da8" },
};

export default function DomainScreen() {
  const { domainId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [filterLevel, setFilterLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);

  const domain = DOMAINS[domainId];
  if (!domain) return <p>Domain not found</p>;

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      try {
        const [challengeData, completionData] = await Promise.all([
          api.get(`/api/challenges/?domain=${domainId}`, token),
          api.get("/api/challenges/completions", token),
        ]);
        setChallenges(challengeData);
        setCompletions(completionData);
      } catch (e) {
        console.error("Failed to load:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [domainId]);

  const isCompleted = (challengeId) => completions.some(c => c.challenge_id === challengeId);

  const startChat = async (challengeId) => {
    if (starting) return;
    setStarting(true);
    const token = getToken();
    try {
      const convo = await api.post("/api/conversations/", { challenge_id: challengeId }, token);
      navigate(`/chat/${convo.id}`, { state: { challengeId: challengeId } });
    } catch (e) {
      console.error("Failed to start conversation:", e);
      setStarting(false);
    }
  };

  const filtered = filterLevel === 0
    ? challenges
    : challenges.filter(c => c.level === filterLevel);

  const completedCount = challenges.filter(c => isCompleted(c.id)).length;

  return (
    <div style={{ minHeight: "100vh", padding: "0 22px 40px" }}>
      <div style={{ padding: "22px 0 18px", animation: "fadeIn 0.4s ease-out" }}>
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "none", color: "var(--text-muted)",
          cursor: "pointer", fontSize: 13.5, padding: "4px 0", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-body)",
        }}>← Back</button>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 32 }}>{domain.icon}</span>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>{domain.label}</h2>
            <p style={{ fontSize: 12.5, color: domain.accent, margin: "3px 0 0", fontFamily: "var(--font-mono)" }}>
              {completedCount} of {challenges.length} completed
            </p>
          </div>
        </div>
      </div>

      {/* Level filter */}
      <div style={{ display: "flex", gap: 7, marginBottom: 20, flexWrap: "wrap" }}>
        {[0, 1, 2, 3, 4, 5].map(lvl => (
          <button key={lvl} onClick={() => setFilterLevel(lvl)} style={{
            padding: "5px 13px", borderRadius: 18,
            background: filterLevel === lvl ? domain.color + "1a" : "rgba(255,255,255,0.025)",
            border: `1px solid ${filterLevel === lvl ? domain.color + "40" : "rgba(255,255,255,0.05)"}`,
            color: filterLevel === lvl ? domain.accent : "var(--text-muted)",
            fontSize: 12, fontWeight: 500,
          }}>
            {lvl === 0 ? "All" : `Level ${lvl}`}
          </button>
        ))}
      </div>

      {/* Challenge list */}
      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading challenges...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((c, i) => {
            const completed = isCompleted(c.id);
            return (
              <div
                key={c.id}
                onClick={() => startChat(c.id)}
                style={{
                  padding: "20px 22px", borderRadius: 14,
                  background: completed ? "rgba(90,180,90,0.06)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${completed ? "rgba(90,180,90,0.2)" : "rgba(255,255,255,0.05)"}`,
                  cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  animation: `fadeSlideIn 0.4s ease-out ${i * 0.05}s both`,
                  position: "relative",
                }}
              >
                {completed && (
                  <div style={{
                    position: "absolute", top: 12, right: 14,
                    fontSize: 11, color: "#7dce82", fontWeight: 600,
                    fontFamily: "var(--font-mono)", letterSpacing: 1,
                  }}>DONE</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[...Array(5)].map((_, j) => (
                      <div key={j} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: j < c.level ? domain.color : "rgba(255,255,255,0.08)",
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                    Level {c.level}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: 15.5, fontWeight: 600, lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.55 }}>{c.description}</p>
              </div>
            );
          })}
        </div>
      )}
      {starting && (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(12,14,20,0.85)",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", zIndex: 10, gap: 16,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: "50%",
      background: "radial-gradient(circle at 35% 35%, var(--accent-light), var(--accent))",
      animation: "breathe 4s ease-in-out infinite",
      boxShadow: "0 0 30px var(--accent-glow)",
    }} />
    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Seynse is preparing your session...</p>
  </div>
    )}
    </div>
  );
}