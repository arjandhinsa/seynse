import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { api } from "../services/api";

export default function CoachChat() {
  const { conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [challengeId, setChallengeId] = useState(null);
  const [showSuds, setShowSuds] = useState(false);
  const [sudsBefore, setSudsBefore] = useState(50);
  const [sudsAfter, setSudsAfter] = useState(50);
  const chatEnd = useRef(null);
  const inputRef = useRef(null);

  const markComplete = async () => {
    if (!challengeId) return;
    const token = getToken();
    try {
      await api.post(`/api/challenges/${challengeId}/complete`, {
        anxiety_before: sudsBefore,
        anxiety_after: sudsAfter,
      }, token);
      setCompleted(true);
      setShowSuds(false);
    } catch (e) {
      console.error("Failed to mark complete:", e);
    }
  };

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      
      // Set challengeId from navigation state immediately
      if (location.state?.challengeId) {
        setChallengeId(location.state.challengeId);
      }

      try {
        const convo = await api.get(`/api/conversations/${conversationId}`, token);
        setMessages(convo.messages);
        if (convo.challenge_id) setChallengeId(convo.challenge_id);

        const completions = await api.get("/api/challenges/completions", token);
        if (completions.some(c => c.challenge_id === (convo.challenge_id || location.state?.challengeId))) {
          setCompleted(true);
        }
      } catch (e) {
        console.error("Failed to load conversation:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [conversationId]);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const content = text || input.trim();
    if (!content || sending) return;
    setInput("");
    setSending(true);

    const userMsg = { id: Date.now().toString(), role: "user", content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const token = getToken();
      const reply = await api.post(
        `/api/conversations/${conversationId}/messages`,
        { content },
        token
      );
      setMessages(prev => [...prev, reply]);
    } catch (e) {
      console.error("Failed to send:", e);
      setMessages(prev => [...prev, {
        id: "error", role: "assistant", content: "Something went wrong — try again.",
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const quickReplies = [
    "I'm feeling nervous about this",
    "What if it goes wrong?",
    "I did it!",
    "I need a smaller first step",
    "Why does this scare me?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
    <div style={{
        padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(0,0,0,0.25)", flexShrink: 0,
    }}>
  <button onClick={() => navigate(-1)} style={{
    background: "none", border: "none", color: "var(--text-muted)",
    cursor: "pointer", fontSize: 18, padding: "4px 6px",
  }}>←</button>
  <div style={{
    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
    background: "radial-gradient(circle at 35% 35%, var(--accent-light), var(--accent))",
    boxShadow: "0 0 12px var(--accent-glow)",
  }} />
  <div style={{ flex: 1 }}>
    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Seynse</h3>
    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
      Social Confidence Coach
    </span>
  </div>
  {completed ? (
    <span style={{ fontSize: 11, color: "#7dce82", fontWeight: 600, fontFamily: "var(--font-mono)" }}>✓ Complete</span>
  ) : (
    <button onClick={() => setShowSuds(true)} style={{
      background: "rgba(90,180,90,0.12)",
      border: "1px solid rgba(90,180,90,0.25)",
      color: "#7dce82", borderRadius: 8, padding: "5px 12px",
      cursor: "pointer", fontSize: 11, fontWeight: 600,
    }}>Done ✓</button>
  )}
</div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px 10px", display: "flex", flexDirection: "column", gap: 14 }}>
        {loading ? (
          <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", marginTop: 40 }}>Loading conversation...</p>
        ) : messages.map((msg, i) => (
          <div key={msg.id} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeSlideIn 0.35s ease-out",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: "radial-gradient(circle at 35% 35%, var(--accent-light), var(--accent))",
                marginRight: 10, marginTop: 2,
                boxShadow: "0 0 12px var(--accent-glow)",
              }} />
            )}
            <div style={{
              maxWidth: "78%", padding: "13px 17px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? "rgba(90,143,126,0.15)" : "rgba(255,255,255,0.035)",
              border: `1px solid ${msg.role === "user" ? "rgba(90,143,126,0.25)" : "rgba(255,255,255,0.05)"}`,
              fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, animation: "fadeSlideIn 0.3s ease-out" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: "radial-gradient(circle at 35% 35%, var(--accent-light), var(--accent))",
              boxShadow: "0 0 12px var(--accent-glow)",
              animation: "breathe 4s ease-in-out infinite",
            }} />
            <div style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "var(--accent-light)", opacity: 0.5,
                  animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={chatEnd} />
      </div>

      {/* Quick replies */}
      <div style={{ padding: "6px 18px 4px", display: "flex", gap: 7, overflowX: "auto", flexShrink: 0 }}>
        {quickReplies.map((qr, i) => (
          <button key={i} onClick={() => send(qr)} style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "var(--text-muted)", borderRadius: 20,
            padding: "7px 13px", fontSize: 12,
            whiteSpace: "nowrap", flexShrink: 0,
          }}>{qr}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: "10px 18px 14px", borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", gap: 10, alignItems: "center",
        background: "rgba(0,0,0,0.2)", flexShrink: 0,
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Share what you're feeling..."
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 12,
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "var(--text-primary)", fontSize: 14,
            outline: "none", fontFamily: "var(--font-body)",
          }}
        />
        <button onClick={() => send()} disabled={!input.trim() || sending} style={{
          width: 42, height: 42, borderRadius: 12,
          background: input.trim() ? "var(--accent)" : "rgba(255,255,255,0.04)",
          border: "none", color: "#fff", fontSize: 17,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: input.trim() ? 1 : 0.35, transition: "all 0.3s",
        }}>↑</button>
      </div>
      {showSuds && (
  <div onClick={() => setShowSuds(false)} style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 20, padding: 24,
    animation: "fadeIn 0.2s ease-out",
  }}>
    <div onClick={e => e.stopPropagation()} style={{
      width: "100%", maxWidth: 360, borderRadius: 20,
      background: "#14161e", border: "1px solid rgba(255,255,255,0.08)",
      padding: "28px 24px",
      animation: "slideUp 0.3s ease-out",
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px", textAlign: "center" }}>
        How did it go?
      </h3>
      <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", margin: "0 0 24px", lineHeight: 1.5 }}>
        Rate your anxiety before and after the challenge. This helps track your progress over time.
      </p>

      {/* Before slider */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Before the challenge</span>
          <span style={{ fontSize: 13, color: "var(--accent-light)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{sudsBefore}</span>
        </div>
        <input
          type="range" min="0" max="100" step="1"
          value={sudsBefore}
          onChange={e => setSudsBefore(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>No anxiety</span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Extreme anxiety</span>
        </div>
      </div>

      {/* After slider */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>After the challenge</span>
          <span style={{ fontSize: 13, color: "var(--accent-light)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{sudsAfter}</span>
        </div>
        <input
          type="range" min="0" max="100" step="1"
          value={sudsAfter}
          onChange={e => setSudsAfter(parseInt(e.target.value))}
          style={{ width: "100%", accentColor: "var(--accent)" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>No anxiety</span>
          <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Extreme anxiety</span>
        </div>
      </div>

      {/* Reduction indicator */}
      {sudsBefore > sudsAfter && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, marginBottom: 18,
          background: "rgba(90,180,90,0.08)",
          border: "1px solid rgba(90,180,90,0.2)",
          textAlign: "center",
        }}>
          <span style={{ fontSize: 13, color: "#7dce82" }}>
            ↓ {sudsBefore - sudsAfter} point reduction — that's real progress
          </span>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setShowSuds(false)} style={{
          flex: 1, padding: "12px 0", borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-primary)", fontSize: 14, fontWeight: 500,
          cursor: "pointer",
        }}>Cancel</button>
        <button onClick={markComplete} style={{
          flex: 1, padding: "12px 0", borderRadius: 12,
          background: "var(--accent)", border: "none",
          color: "#fff", fontSize: 14, fontWeight: 600,
          cursor: "pointer",
        }}>Complete ✓</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}