// screens.jsx — Seynsei (calm/painterly direction)
// Quiet dark mode • soft rounded corners • generous whitespace

// ═══════════════════════════════════════════════════════════════
// SCREEN 1: HOME
// ═══════════════════════════════════════════════════════════════
function HomeScreen({ onNav, onSelectChallenge, xpProminence = 'tucked', density = 'low', gender = 'male' }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', color: 'var(--ink)' }} className="paper">
      <DustMotes count={10} />
      <div style={{ height: 50 }} />

      <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 22px 110px', position: 'relative' }}>

        {/* Greeting + identity */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
          <div>
            <div className="label">Tuesday · evening</div>
            <div className="display" style={{ fontSize: 30, color: 'var(--ink)', marginTop: 6, lineHeight: 1.1 }}>
              Welcome back, <span className="display-italic">Mira</span>.
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.4, maxWidth: 280 }}>
              Take a breath. There's no rush tonight.
            </div>
          </div>
          <StreakCounter days={7} />
        </div>

        {/* Level + XP — quiet, integrated */}
        <SoftCard padding={18} radius="var(--r-lg)" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <LevelMarker level={3} tier={3} size={48} />
            <div style={{ flex: 1 }}>
              <div className="label">your path</div>
              <div className="display" style={{ fontSize: 17, color: 'var(--ink)', marginTop: 2, letterSpacing: '0.005em' }}>
                The Apprentice
              </div>
              <div className="body" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>
                16 small bridges crossed
              </div>
            </div>
          </div>
          <XPBar current={320} max={400} />
        </SoftCard>

        {/* Two domain cards — soft, breathing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
          <DomainCard
            title="Everyday" subtitle="social"
            accent="var(--teal)" tone="teal"
            done={12} total={28}
            onClick={() => onSelectChallenge && onSelectChallenge('SOCIAL')} />
          <DomainCard
            title="Connection" subtitle="dating"
            accent="var(--rose)" tone="rose"
            done={4} total={24}
            onClick={() => onSelectChallenge && onSelectChallenge('DATING')} />
        </div>

        {/* Today's whisper — single quiet recommendation */}
        <div className="label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Leaf size={11} color="var(--gold-2)" />
          <span style={{ color: 'var(--gold-2)' }}>tonight, if you'd like</span>
        </div>
        <TonightCard onClick={() => onSelectChallenge && onSelectChallenge('SOCIAL')} />

        {/* This week — soft dot row */}
        <div className="label" style={{ marginTop: 26, marginBottom: 10 }}>this week</div>
        <SoftCard padding={16}>
          <WeekDots />
        </SoftCard>
      </div>

      <TabNav active="home" onChange={onNav} />
    </div>
  );
}

function DomainCard({ title, subtitle, accent, done, total, onClick }) {
  const pct = (done / total) * 100;
  return (
    <SoftCard onClick={onClick} padding={16} radius="var(--r-lg)" style={{
      borderColor: `oklch(from ${accent} l c h / 0.30)`,
      background: `linear-gradient(165deg, oklch(from ${accent} calc(l - 0.36) calc(c + 0.02) h / 0.45) 0%, var(--bg-2) 65%)`,
    }}>
      {/* soft orb top-right */}
      <div style={{
        position: 'absolute', top: -22, right: -22,
        width: 80, height: 80, borderRadius: '50%',
        background: `radial-gradient(circle, oklch(from ${accent} l c h / 0.30) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div className="label" style={{ color: `oklch(from ${accent} calc(l + 0.08) c h)`, opacity: 0.95 }}>
        {subtitle}
      </div>
      <div className="display" style={{
        fontSize: 22, color: 'var(--ink)', marginTop: 4, lineHeight: 1.1, letterSpacing: '0.005em',
      }}>{title}</div>

      {/* arc progress — minimal */}
      <div style={{ marginTop: 14, marginBottom: 10 }}>
        <ArcProgress pct={pct} accent={accent} />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="display tnum" style={{ fontSize: 20, color: 'var(--ink)' }}>{done}</span>
        <span className="body tnum" style={{ fontSize: 12, color: 'var(--ink-3)' }}>of {total}</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
        wander in <ChevronRight size={11} />
      </div>
    </SoftCard>
  );
}

function ArcProgress({ pct, accent }) {
  const r = 22, cx = 26, cy = 26;
  const circ = 2 * Math.PI * r;
  const dashoffset = circ * (1 - pct / 100);
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" style={{ display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none"
              stroke="oklch(from var(--bg-3) l c h / 0.7)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r} fill="none"
              stroke={accent} strokeWidth="2"
              strokeDasharray={circ} strokeDashoffset={dashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: `drop-shadow(0 0 4px oklch(from ${accent} l c h / 0.4))` }} />
      {/* center moon */}
      <circle cx={cx} cy={cy} r="3" fill={accent} opacity="0.85" />
    </svg>
  );
}

function TonightCard({ onClick }) {
  return (
    <SoftCard onClick={onClick} padding={18} radius="var(--r-lg)" style={{
      borderColor: 'oklch(from var(--gold) l c h / 0.35)',
      background: 'linear-gradient(160deg, oklch(from var(--gold) calc(l - 0.45) calc(c - 0.03) h / 0.30) 0%, var(--bg-2) 70%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <TierDot tier={2} size={14} withLabel={false} />
        <div style={{ flex: 1 }}>
          <div className="display-italic" style={{ fontSize: 19, color: 'var(--ink)', lineHeight: 1.25 }}>
            Ask the barista their name.
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 8, lineHeight: 1.5 }}>
            A small bridge from script to spontaneity. Say hello. That's all.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
            <XPValue amount={5} tier={2} />
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>about five minutes</span>
          </div>
        </div>
        <ChevronRight size={14} color="var(--ink-3)" />
      </div>
    </SoftCard>
  );
}

function WeekDots() {
  const days = [
    { d: 'M', done: true }, { d: 'T', done: true }, { d: 'W', done: true },
    { d: 'T', done: true }, { d: 'F', done: true }, { d: 'S', done: true },
    { d: 'S', done: true, today: true },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {days.map((day, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
          <span className="body" style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.04em' }}>{day.d}</span>
          <div style={{
            width: day.today ? 11 : 8, height: day.today ? 11 : 8, borderRadius: '50%',
            background: day.done ? 'var(--gold-2)' : 'var(--bg-3)',
            opacity: day.done ? (day.today ? 1 : 0.85) : 0.4,
            boxShadow: day.today ? '0 0 14px oklch(from var(--gold) l c h / 0.55)' : 'none',
            border: day.today ? '1px solid oklch(from var(--gold) l c h / 0.6)' : 'none',
          }} />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 2: PRACTICE / BROWSE
// ═══════════════════════════════════════════════════════════════
const SOCIAL_CHALLENGES = [
  { tier: 1, name: 'Make eye contact for three seconds', desc: 'With one stranger today. Just three.', xp: 1, time: '1 min', pinned: true },
  { tier: 1, name: 'Greet a coworker by name', desc: 'A nod and a "morning, ___" is enough.', xp: 1, time: '1 min' },
  { tier: 2, name: 'Ask the barista their name', desc: 'A small bridge from script to spontaneity.', xp: 5, time: '5 min' },
  { tier: 2, name: "Compliment a stranger's outfit", desc: 'Specific is better than general. "I like your boots."', xp: 5, time: '2 min' },
  { tier: 3, name: 'Start a 30-second conversation in line', desc: 'Comment on the weather, the wait, anything.', xp: 15, time: '5 min' },
  { tier: 3, name: 'Sit in a café for one hour without your phone', desc: 'Open posture. Notice who looks back.', xp: 15, time: '1 hr' },
  { tier: 4, name: 'Join a group conversation uninvited', desc: 'Linger at the edge. Add one comment when natural.', xp: 30, time: '15 min' },
  { tier: 5, name: 'Tell a story to three or more people', desc: 'Two minutes minimum. Watch the room with you.', xp: 60, time: '20 min' },
];
const DATING_CHALLENGES = [
  { tier: 1, name: 'Hold eye contact across a room', desc: 'Three seconds. A quiet hello, no follow-up needed.', xp: 1, time: '1 min', pinned: true },
  { tier: 2, name: 'Smile at someone you find attractive', desc: 'Then look away. Then look back if it felt warm.', xp: 5, time: '1 min' },
  { tier: 2, name: 'Send the first message on an app', desc: 'Reference something specific. Skip "hey".', xp: 5, time: '5 min' },
  { tier: 3, name: 'Ask a coworker about their weekend', desc: 'With genuine curiosity. Listen for the second half.', xp: 15, time: '5 min' },
  { tier: 4, name: 'Suggest grabbing a coffee', desc: 'Low-stakes daytime venue. Have a backup time.', xp: 30, time: '5 min' },
  { tier: 5, name: 'Tell someone you find them interesting', desc: "Specifically. Not 'you're cool' — why.", xp: 60, time: '5 min' },
];

function ChallengeBrowseScreen({ onNav, onPick, gender = 'male' }) {
  const [tab, setTab] = React.useState('SOCIAL');
  const list = tab === 'SOCIAL' ? SOCIAL_CHALLENGES : DATING_CHALLENGES;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', color: 'var(--ink)' }} className="paper">
      <DustMotes count={8} />
      <div style={{ height: 50 }} />
      <div style={{ padding: '14px 22px 14px', position: 'relative' }}>
        <div className="label">practice</div>
        <div className="display" style={{ fontSize: 28, color: 'var(--ink)', marginTop: 6, letterSpacing: '0.005em', lineHeight: 1.1 }}>
          Choose what to <span className="display-italic">try</span>.
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 7, lineHeight: 1.45 }}>
          Pick something just slightly uncomfortable.
        </div>

        <div style={{ display: 'flex', gap: 22, marginTop: 22 }}>
          {[
            { id: 'SOCIAL', label: 'Everyday social' },
            { id: 'DATING', label: 'Connection' },
          ].map(t => {
            const isActive = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                      className={isActive ? 'handline' : ''}
                      style={{
                        padding: '4px 0',
                        fontFamily: 'var(--display)',
                        fontStyle: isActive ? 'italic' : 'normal',
                        fontWeight: 400,
                        fontSize: 16,
                        color: isActive ? 'var(--ink)' : 'var(--ink-3)',
                      }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 22px 110px', position: 'relative' }}>
        {list.map((c, i) => (
          <ChallengeRow key={i} c={c} onClick={() => onPick && onPick(c)} />
        ))}
      </div>
      <TabNav active="challenges" onChange={onNav} />
    </div>
  );
}

function ChallengeRow({ c, onClick }) {
  return (
    <div onClick={onClick} className="tap" style={{
      padding: '16px 4px 16px 4px',
      borderBottom: '1px solid oklch(from var(--line) l c h / 0.5)',
      cursor: 'pointer',
      position: 'relative',
      ...(c.pinned ? {
        background: 'linear-gradient(90deg, oklch(from var(--gold) calc(l - 0.45) c h / 0.18) 0%, transparent 80%)',
        marginLeft: -22, marginRight: -22, paddingLeft: 22, paddingRight: 22,
        borderRadius: 0,
      } : {}),
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ marginTop: 4 }}>
          <TierDot tier={c.tier} size={12} withLabel={false} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {c.pinned && (
            <div className="label" style={{ color: 'var(--gold-2)', marginBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Leaf size={9} color="var(--gold-2)" /> tonight's whisper
            </div>
          )}
          <div className="display" style={{
            fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.3, letterSpacing: '0.005em',
          }}>{c.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 5, lineHeight: 1.45 }}>
            {c.desc}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 9 }}>
            <XPValue amount={c.xp} tier={c.tier} size="sm" />
            <span className="body" style={{ fontSize: 11, color: 'var(--ink-3)' }}>~{c.time}</span>
          </div>
        </div>
        <ChevronRight size={13} color="var(--ink-3)" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 3: COMPLETION — affirming, not celebratory
// ═══════════════════════════════════════════════════════════════
function CelebrationScreen({ onNav, onCoach, challenge, gender = 'male' }) {
  const c = challenge || SOCIAL_CHALLENGES[2];
  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', color: 'var(--ink)' }} className="paper-deep">
      {/* slow drifting petals */}
      <DustMotes count={20} kind="petal" color="oklch(85% 0.06 30 / 0.45)" />
      <DustMotes count={10} kind="mote" color="oklch(85% 0.05 80 / 0.4)" />

      {/* soft warm wash from above */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 320,
        background: 'radial-gradient(ellipse 70% 80% at 50% 0%, oklch(from var(--gold) calc(l - 0.30) calc(c - 0.02) h / 0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ height: 50 }} />
      <div style={{ padding: '40px 30px 110px', position: 'relative', zIndex: 2 }}>

        <div className="fade-up" style={{ textAlign: 'center', marginTop: 18 }}>
          <div className="label" style={{ color: 'var(--gold-2)', fontSize: 10, letterSpacing: '0.32em', opacity: 0.9 }}>
            you crossed a bridge
          </div>
          <div className="display-italic" style={{
            fontSize: 56, color: 'var(--ink)', marginTop: 14, lineHeight: 1.05,
            letterSpacing: '-0.005em',
          }}>
            Well done.
          </div>
          <div className="body" style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 14, maxWidth: 280, margin: '14px auto 0', lineHeight: 1.5 }}>
            That was harder than it looked from the outside. It always is.
          </div>
        </div>

        {/* the quest, quietly */}
        <div className="fade-up" style={{ marginTop: 36, animationDelay: '0.4s' }}>
          <SoftCard padding={18} radius="var(--r-lg)" style={{
            borderColor: 'oklch(from var(--gold) l c h / 0.30)',
          }}>
            <div className="label" style={{ marginBottom: 8 }}>what you did</div>
            <div className="display-italic" style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.3 }}>
              "{c.name}"
            </div>
            <div style={{ marginTop: 12 }}>
              <TierDot tier={c.tier} size={11} />
            </div>
          </SoftCard>
        </div>

        {/* xp — quiet, not a pill */}
        <div className="fade-up" style={{ marginTop: 22, animationDelay: '0.7s' }}>
          <div className="label" style={{ marginBottom: 10 }}>your path</div>
          <SoftCard padding={18} radius="var(--r-lg)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <LevelMarker level={3} tier={3} size={42} />
              <div style={{ flex: 1 }}>
                <div className="body" style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
                  <span className="tnum" style={{ color: 'var(--gold-2)', fontWeight: 600 }}>+{c.xp}</span> earned ·
                  <span style={{ color: 'var(--ink-3)' }}> +10 quiet bonus</span>
                </div>
                <div className="body" style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>
                  for showing up first time at this tier
                </div>
              </div>
            </div>
            <XPBar current={335} max={400} animateFrom={320} />
          </SoftCard>
        </div>

        {/* gentle next step */}
        <div className="fade-up" style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 12, animationDelay: '1.0s' }}>
          <SoftButton primary onClick={onCoach}>Reflect with Sensei</SoftButton>
          <SoftButton onClick={() => onNav && onNav('home')}>Rest for now</SoftButton>
        </div>
      </div>
    </div>
  );
}

function SoftButton({ children, primary, onClick }) {
  return (
    <button onClick={onClick} className="tap" style={{
      padding: '15px 18px',
      width: '100%',
      borderRadius: 'var(--r-pill)',
      background: primary
        ? 'linear-gradient(180deg, oklch(from var(--gold) calc(l - 0.18) c h) 0%, oklch(from var(--gold) calc(l - 0.32) c h) 100%)'
        : 'transparent',
      border: primary ? '1px solid oklch(from var(--gold) l c h / 0.55)' : '1px solid oklch(from var(--ink) l c h / 0.20)',
      color: primary ? 'var(--ink)' : 'var(--ink-2)',
      fontFamily: 'var(--display)',
      fontStyle: primary ? 'normal' : 'italic',
      fontSize: 15,
      fontWeight: 400,
      letterSpacing: '0.01em',
      boxShadow: primary ? '0 0 28px oklch(from var(--gold) l c h / 0.25)' : 'none',
    }}>
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 4: COACH
// ═══════════════════════════════════════════════════════════════
function CoachScreen({ onNav, gender = 'male' }) {
  const [messages, setMessages] = React.useState([
    { role: 'coach', text: "You completed a Tier 2 today. How did your body feel right before you spoke?", t: '2:14' },
    { role: 'user',  text: "Tight in the chest. My voice felt smaller than I wanted.", t: '2:15' },
    { role: 'coach', text: "That's the threshold sensation — it shows up before nearly every meaningful interaction. The body doesn't know the difference between unsafe and unfamiliar.", t: '2:15' },
    { role: 'coach', text: "Try this with the next quest: name it quietly, in your head. \"This is the threshold.\" Then act anyway.", t: '2:16' },
  ]);
  const [draft, setDraft] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  const send = () => {
    if (!draft.trim()) return;
    setMessages(m => [...m, { role: 'user', text: draft, t: 'now' }]);
    setDraft('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages(m => [...m, { role: 'coach', text: "Mm. Sit with that for a moment. What would you tell a friend who said the same thing?", t: 'now' }]);
    }, 1200);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', color: 'var(--ink)' }} className="paper">
      <div style={{ height: 50 }} />

      {/* Header — calm portrait */}
      <div style={{
        padding: '12px 22px 16px',
        display: 'flex', alignItems: 'center', gap: 14,
        borderBottom: '1px solid oklch(from var(--line) l c h / 0.45)',
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: 'var(--bg-3)',
          border: '1px solid oklch(from var(--gold) l c h / 0.4)',
          overflow: 'hidden', flexShrink: 0,
          boxShadow: '0 0 22px oklch(from var(--gold) l c h / 0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
            <CoachPortrait size={56} gender={gender} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="display" style={{ fontSize: 19, color: 'var(--ink)', letterSpacing: '0.005em' }}>Sensei</div>
          <div className="body" style={{ fontSize: 11.5, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--teal)', boxShadow: '0 0 6px var(--teal)' }} />
            here whenever you want
          </div>
        </div>
        <Moon size={18} color="var(--ink-3)" />
      </div>

      <div ref={scrollRef} className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 14px' }}>
        {messages.map((m, i) => (
          m.role === 'coach'
            ? <CoachBubble key={i} text={m.text} t={m.t} gender={gender} showBust={i === 0 || messages[i-1]?.role === 'user'} />
            : <UserBubble key={i} text={m.text} t={m.t} />
        ))}
        {thinking && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 30, flexShrink: 0 }} />
            <div style={{
              padding: '12px 16px',
              borderRadius: 'var(--r-lg) var(--r-lg) var(--r-lg) 6px',
              background: 'var(--bg-2)',
              border: '1px solid oklch(from var(--line) l c h / 0.6)',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: '50%', background: 'var(--ink-3)',
                  animation: `pulse 1.4s ease-in-out ${i * 0.18}s infinite`,
                }} />
              ))}
              <style>{`@keyframes pulse { 0%, 100% { opacity: 0.25 } 50% { opacity: 0.85 } }`}</style>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '12px 22px 18px', borderTop: '1px solid oklch(from var(--line) l c h / 0.5)' }}>
        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid oklch(from var(--line) l c h / 0.7)',
          borderRadius: 'var(--r-pill)',
          padding: '8px 8px 8px 18px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <input value={draft} onChange={e => setDraft(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && send()}
                 placeholder="share what you noticed…"
                 style={{
                   flex: 1, border: 'none', background: 'transparent', outline: 'none',
                   fontFamily: 'var(--body)', fontSize: 14, color: 'var(--ink)',
                 }} />
          <button onClick={send} className="tap" style={{
            background: 'oklch(from var(--gold) calc(l - 0.30) c h / 0.7)',
            border: '1px solid oklch(from var(--gold) l c h / 0.4)',
            width: 36, height: 36, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <PaperCrane size={18} color="var(--gold-2)" />
          </button>
        </div>
      </div>
      <TabNav active="coach" onChange={onNav} />
    </div>
  );
}

function CoachBubble({ text, t, showBust, gender = 'male' }) {
  return (
    <div className="fade-up" style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      {showBust ? (
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--bg-3)',
          border: '1px solid oklch(from var(--gold) l c h / 0.35)',
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
            <CoachPortrait size={36} gender={gender} />
          </div>
        </div>
      ) : <div style={{ width: 30, flexShrink: 0 }} />}
      <div style={{ flex: 1, maxWidth: '82%' }}>
        <div style={{
          padding: '13px 17px',
          background: 'var(--bg-2)',
          border: '1px solid oklch(from var(--line) l c h / 0.6)',
          borderRadius: 'var(--r-lg) var(--r-lg) var(--r-lg) 6px',
          fontFamily: 'var(--body)',
          fontSize: 14, color: 'var(--ink)', lineHeight: 1.55,
        }}>
          {text}
        </div>
        <div className="body" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 5, marginLeft: 6, opacity: 0.75 }}>
          Sensei · {t}
        </div>
      </div>
    </div>
  );
}

function UserBubble({ text, t }) {
  return (
    <div className="fade-up" style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '13px 17px',
          background: 'oklch(from var(--teal) calc(l - 0.40) calc(c - 0.02) h / 0.55)',
          border: '1px solid oklch(from var(--teal) l c h / 0.30)',
          borderRadius: 'var(--r-lg) var(--r-lg) 6px var(--r-lg)',
          fontFamily: 'var(--body)',
          fontSize: 14, color: 'var(--ink)', lineHeight: 1.5,
        }}>
          {text}
        </div>
        <div className="body" style={{ fontSize: 10, color: 'var(--ink-3)', marginTop: 5, marginRight: 6, textAlign: 'right', opacity: 0.75 }}>
          {t}
        </div>
      </div>
    </div>
  );
}

// Sensei portrait — uses the same painterly character system,
// always at the Sage stage, gender mirrors the user (male sensei for male user, female for female).
function CoachPortrait({ size = 56, gender = 'male' }) {
  return (
    <AnimePortrait tier={5} variant="sage" size={size} gender={gender} elder={true} />
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREEN 5: AVATAR SELECTOR (CHOOSE YOUR FORM)
// ═══════════════════════════════════════════════════════════════
const AVATARS = [
  { id: 1, tier: 1, name: 'The Hidden',     variant: 'hidden',     unlock: 'Starting form',           desc: 'A misty park path at dawn.',          equipped: false, unlocked: true },
  { id: 2, tier: 2, name: 'The Seeker',     variant: 'seeker',     unlock: 'Reach Level 2',           desc: 'Tea by the café window.',             equipped: false, unlocked: true },
  { id: 3, tier: 3, name: 'The Apprentice', variant: 'apprentice', unlock: 'Reach Level 3',           desc: 'A walled garden, late afternoon.',    equipped: true,  unlocked: true },
  { id: 4, tier: 4, name: 'The Adept',      variant: 'adept',      unlock: 'Reach Level 4',           desc: 'A market square at golden hour.',     equipped: false, unlocked: false },
  { id: 5, tier: 5, name: 'The Open',       variant: 'open',       unlock: 'Reach Level 5',           desc: 'A hilltop, palms open to dawn.',      equipped: false, unlocked: false },
  { id: 6, tier: 5, name: 'The Sage',       variant: 'sage',       unlock: 'Reach Level 6',           desc: 'Tea on the porch at sunset.',         equipped: false, unlocked: false },
];

function AvatarSelectorScreen({ onNav, gender = 'male' }) {
  const [selected, setSelected] = React.useState(3);
  const sel = AVATARS.find(a => a.id === selected);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', color: 'var(--ink)' }} className="paper">
      <DustMotes count={14} />
      <div style={{ height: 50 }} />

      <div style={{ padding: '14px 22px 14px', position: 'relative' }}>
        <div className="label">your forms</div>
        <div className="display" style={{ fontSize: 28, color: 'var(--ink)', marginTop: 6, letterSpacing: '0.005em', lineHeight: 1.1 }}>
          Choose your <span className="display-italic">form</span>.
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 7, lineHeight: 1.45 }}>
          Equipped: <span style={{ color: 'var(--gold-2)', fontStyle: 'italic' }}>The Apprentice</span>
        </div>
      </div>

      <div className="scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 110px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {AVATARS.map(a => (
            <AvatarCard key={a.id} a={a} selected={selected === a.id} gender={gender}
                        onClick={() => a.unlocked && setSelected(a.id)} />
          ))}
        </div>
        <button onClick={() => sel && sel.unlocked && alert(`Equipped: ${sel.name}`)}
                disabled={!sel?.unlocked}
                className="tap"
                style={{
                  marginTop: 22, width: '100%',
                  padding: '15px 18px',
                  borderRadius: 'var(--r-pill)',
                  background: sel?.unlocked
                    ? 'linear-gradient(180deg, oklch(from var(--gold) calc(l - 0.18) c h) 0%, oklch(from var(--gold) calc(l - 0.32) c h) 100%)'
                    : 'transparent',
                  border: sel?.unlocked
                    ? '1px solid oklch(from var(--gold) l c h / 0.55)'
                    : '1px solid oklch(from var(--ink) l c h / 0.15)',
                  color: sel?.unlocked ? 'var(--ink)' : 'var(--ink-3)',
                  fontFamily: 'var(--display)',
                  fontStyle: 'normal',
                  fontSize: 15,
                  letterSpacing: '0.01em',
                  boxShadow: sel?.unlocked ? '0 0 28px oklch(from var(--gold) l c h / 0.25)' : 'none',
                }}>
          {sel?.unlocked ? `Equip ${sel.name}` : 'Locked'}
        </button>
      </div>
      <TabNav active="profile" onChange={onNav} />
    </div>
  );
}

function AvatarCard({ a, selected, onClick, gender = 'male' }) {
  const color = TIER_COLORS[a.tier];
  return (
    <div onClick={onClick} className={a.unlocked ? 'tap' : ''}
         style={{
           background: a.unlocked
             ? `linear-gradient(180deg, oklch(from ${color} calc(l - 0.32) calc(c + 0.02) h / 0.30) 0%, var(--bg-2) 80%)`
             : 'var(--bg-2)',
           border: a.equipped
             ? `1px solid oklch(from var(--gold) l c h / 0.7)`
             : selected
               ? `1px solid oklch(from ${color} l c h / 0.55)`
               : '1px solid var(--line)',
           borderRadius: 'var(--r-lg)',
           padding: 14,
           cursor: a.unlocked ? 'pointer' : 'default',
           position: 'relative',
           boxShadow: a.equipped
             ? '0 0 32px oklch(from var(--gold) l c h / 0.22)'
             : selected
               ? `0 0 22px oklch(from ${color} l c h / 0.18)`
               : 'none',
           opacity: a.unlocked ? 1 : 0.85,
         }}>

      {/* portrait area — scene is baked into the SVG */}
      <div style={{
        height: 156,
        borderRadius: 'var(--r-md)',
        background: 'var(--bg-3)',
        display: 'flex', alignItems: 'stretch', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        marginBottom: 12,
        border: '1px solid oklch(from var(--line) l c h / 0.5)',
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <AnimePortrait tier={a.tier} variant={a.variant} locked={!a.unlocked} size={140} gender={gender} />
        </div>
        {!a.unlocked && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'oklch(from var(--bg) l c h / 0.45)',
            backdropFilter: 'blur(1px)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'oklch(from var(--bg) l c h / 0.88)',
              border: '1px solid oklch(from var(--line) l c h / 0.7)',
              borderRadius: 'var(--r-pill)',
            }}>
              <LockIcon size={11} color="var(--ink-2)" />
              <span className="body" style={{ fontSize: 10.5, color: 'var(--ink-2)', letterSpacing: '0.04em' }}>
                {a.unlock.toLowerCase()}
              </span>
            </div>
          </div>
        )}
        {a.equipped && (
          <div style={{
            position: 'absolute', top: 8, right: 8,
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '3px 9px',
            background: 'oklch(from var(--gold) calc(l - 0.30) c h / 0.88)',
            border: '1px solid oklch(from var(--gold) l c h / 0.6)',
            borderRadius: 'var(--r-pill)',
          }}>
            <Sparkle size={9} color="var(--gold-2)" />
            <span className="body" style={{ fontSize: 9.5, color: 'var(--gold-2)', letterSpacing: '0.05em', fontWeight: 600 }}>
              equipped
            </span>
          </div>
        )}
      </div>

      <div className="display" style={{
        fontSize: 15, color: a.unlocked ? 'var(--ink)' : 'var(--ink-3)',
        textAlign: 'center', letterSpacing: '0.005em',
      }}>{a.name}</div>
      {a.desc && (
        <div className="body" style={{
          fontSize: 11, color: 'var(--ink-3)',
          textAlign: 'center', marginTop: 4, fontStyle: 'italic',
          lineHeight: 1.3,
        }}>{a.desc}</div>
      )}
      <div style={{ marginTop: 7, display: 'flex', justifyContent: 'center' }}>
        <TierDot tier={a.tier} size={9} withLabel={false} />
      </div>
    </div>
  );
}

function LockIcon({ size = 12, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" stroke={color} strokeWidth="1" />
      <path d="M4 5.5 V 4 a 2 2 0 0 1 4 0 V 5.5" stroke={color} strokeWidth="1" fill="none" />
    </svg>
  );
}

Object.assign(window, {
  HomeScreen, ChallengeBrowseScreen, CelebrationScreen, CoachScreen, AvatarSelectorScreen,
  SOCIAL_CHALLENGES, DATING_CHALLENGES,
});
