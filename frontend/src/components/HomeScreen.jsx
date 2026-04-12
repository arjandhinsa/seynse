import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { api } from "../services/api";

const DOMAINS = {
  social: { label: "Everyday Social", icon: "👋", color: "#5B8C5A", accent: "#78b577", description: "Daily interactions & casual conversations" },
  professional: { label: "Career & Professional", icon: "💼", color: "#4A6FA5", accent: "#6b93cc", description: "Interviews, networking & workplace confidence" },
  romantic: { label: "Dating & Connection", icon: "💜", color: "#8B5E83", accent: "#b07da8", description: "Building confidence in romantic contexts" },
};

const AFFIRMATIONS = [
  "Every step forward counts, no matter how small.",
  "Courage isn't the absence of fear — it's acting despite it.",
  "You're rewiring your brain right now. That's extraordinary.",
  "Growth happens at the edge of your comfort zone.",
  "You deserve connection, confidence, and belonging.",
  "Today's discomfort is tomorrow's confidence.",
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const { getToken, logout } = useAuth();
  const [domainProgress, setDomainProgress] = useState([]);
  const [summary, setSummary] = useState(null);
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const [anxietyStats, setAnxietyStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const [summaryData, domainsData, completionsData] = await Promise.all([
        api.get("/api/progress/summary", token),
        api.get("/api/progress/domains", token),
        api.get("/api/challenges/completions", token),
        ]);
        setSummary(summaryData);
        setDomainProgress(domainsData);

        // Calculate anxiety stats from completions
        const rated = completionsData.filter(c => c.anxiety_before !== null && c.anxiety_after !== null);
        if (rated.length > 0) {
            const totalReduction = rated.reduce((sum, c) => sum + (c.anxiety_before - c.anxiety_after), 0);
            const avgReduction = Math.round(totalReduction / rated.length);
            const avgBefore = Math.round(rated.reduce((sum, c) => sum + c.anxiety_before, 0) / rated.length);
            const avgAfter = Math.round(rated.reduce((sum, c) => sum + c.anxiety_after, 0) / rated.length);
            setAnxietyStats({ avgReduction, avgBefore, avgAfter, count: rated.length });
        }
        setSummary(summaryData);
        setDomainProgress(domainsData);
      } catch (e) {
        console.error("Failed to load progress:", e);
      }
    };
    load();
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: "0 22px 40px", overflowY: "auto" }}>
      {/* Ambient background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 500px 350px at 15% 15%, rgba(90,143,126,0.06), transparent), radial-gradient(ellipse 400px 400px at 85% 80%, rgba(139,94,131,0.04), transparent)",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: 4, textTransform: "uppercase" }}>SEYN</div>
         <button onClick={logout} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.07)",
            color: "var(--text-muted)", borderRadius: 8, padding: "5px 12px",
            fontSize: 11, cursor: "pointer",
        }}>Log out</button>
        </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "44px 0 32px", animation: "fadeIn 0.7s ease-out" }}>
          <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 20 }}>SEYN</div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, var(--accent-light), var(--accent))",
              animation: "breathe 4s ease-in-out infinite",
              boxShadow: "0 0 30px var(--accent-glow)",
            }} />
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8 }}>Seynse</h1>
          <p style={{ fontSize: 13, color: "var(--accent-light)", fontFamily: "var(--font-mono)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Social Confidence Coach</p>
          <p style={{ fontSize: 14.5, color: "var(--text-muted)", maxWidth: 380, margin: "0 auto", lineHeight: 1.6, fontStyle: "italic" }}>"{affirmation}"</p>
        </div>

        {/* Progress bar */}
        {summary && (
          <div style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 14, padding: "16px 20px", marginBottom: 28,
            animation: "slideUp 0.5s ease-out 0.15s both",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Your Journey</span>
              <span style={{ fontSize: 12.5, color: "var(--accent-light)", fontWeight: 600 }}>{summary.total_completed} / {summary.total_challenges} challenges</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${summary.completion_percentage}%`,
                background: "linear-gradient(90deg, var(--accent), var(--accent-light))",
                transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
          </div>
        )}


        {/* Anxiety progress */}
        {anxietyStats && (
        <div style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: 14, padding: "18px 20px", marginBottom: 24,
            animation: "slideUp 0.5s ease-out 0.2s both",
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>Anxiety Progress</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{anxietyStats.count} rated {anxietyStats.count === 1 ? "challenge" : "challenges"}</span>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{
                flex: 1, padding: "12px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                textAlign: "center",
            }}>
                <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{anxietyStats.avgBefore}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0" }}>Avg before</p>
            </div>
            <div style={{
                flex: 1, padding: "12px", borderRadius: 10,
                background: "rgba(255,255,255,0.03)",
                textAlign: "center",
            }}>
                <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>{anxietyStats.avgAfter}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "4px 0 0" }}>Avg after</p>
            </div>
            <div style={{
                flex: 1, padding: "12px", borderRadius: 10,
                background: "rgba(90,180,90,0.08)",
                border: "1px solid rgba(90,180,90,0.15)",
                textAlign: "center",
            }}>
                <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#7dce82" }}>↓{anxietyStats.avgReduction}</p>
                <p style={{ fontSize: 11, color: "#7dce82", margin: "4px 0 0" }}>Avg reduction</p>
            </div>
            </div>

            {/* Visual bar comparing before and after */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", width: 40 }}>Before</span>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                height: "100%", width: `${anxietyStats.avgBefore}%`,
                background: "var(--text-muted)", borderRadius: 3,
                transition: "width 0.6s ease",
                }} />
            </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "#7dce82", width: 40 }}>After</span>
            <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                height: "100%", width: `${anxietyStats.avgAfter}%`,
                background: "#7dce82", borderRadius: 3,
                transition: "width 0.6s ease",
                }} />
            </div>
            </div>
        </div>
        )}

        {/* Domain cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Object.entries(DOMAINS).map(([key, domain], i) => {
            const prog = domainProgress.find(d => d.domain === key);
            return (
              <div
                key={key}
                onClick={() => navigate(`/domain/${key}`)}
                style={{
                  padding: "20px 22px", borderRadius: 16,
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                  animation: `slideUp 0.5s ease-out ${0.25 + i * 0.1}s both`,
                  position: "relative", overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: domain.color, borderRadius: "3px 0 0 3px", opacity: 0.5 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 26 }}>{domain.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 15.5, fontWeight: 600, margin: 0 }}>{domain.label}</h3>
                    <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0" }}>{domain.description}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 19, fontWeight: 700, color: domain.accent }}>{prog ? prog.percentage : 0}%</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{prog ? prog.completed : 0}/{prog ? prog.total : 0}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${prog ? prog.percentage : 0}%`, background: domain.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Method explainer */}
        <div style={{
          marginTop: 32, padding: "20px 22px", borderRadius: 16,
          background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)",
          animation: "slideUp 0.5s ease-out 0.6s both",
        }}>
          <h3 style={{ fontSize: 11.5, fontWeight: 500, color: "var(--accent-light)", marginBottom: 10, fontFamily: "var(--font-mono)", letterSpacing: 2, textTransform: "uppercase" }}>The Seynse Method</h3>
          <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.7 }}>
            Seynse uses <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>graduated exposure therapy</strong> — the gold-standard approach for social anxiety. Start with gentle, low-stakes challenges and progressively build confidence.
          </p>
        </div>
      </div>
    </div>
  );
}