// primitives.jsx — Seynsei (calm/painterly direction)
// Animal Crossing gentleness × Studio Ghibli atmosphere
// Soft rounded corners only • desaturated accents • anime portraits
// All originals; no copyrighted/branded UI references.

const TIER_COLORS = {
  1: 'var(--t1)', 2: 'var(--t2)', 3: 'var(--t3)', 4: 'var(--t4)', 5: 'var(--t5)',
};
const TIER_NAMES = {
  1: 'sage',      // sage green
  2: 'dusk',      // dusk blue
  3: 'heather',   // heather purple
  4: 'amber',     // warm amber
  5: 'rose-gold', // deep rose gold
};

// ──────────────────────────────────────────────────────────────
// Level marker — soft glowing orb (replaces hex shield)
// ──────────────────────────────────────────────────────────────
function LevelMarker({ level = 3, tier = 3, size = 56 }) {
  const color = TIER_COLORS[tier];
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div className="aura" style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 30% 30%, oklch(from ${color} calc(l + 0.04) c h / 0.55) 0%, oklch(from ${color} calc(l - 0.18) c h / 0.85) 70%)`,
        boxShadow: `inset 0 0 0 1px oklch(from ${color} l c h / 0.6), 0 0 24px oklch(from ${color} l c h / 0.20)`,
      }} />
      <div className="breathe" style={{
        position: 'absolute', inset: -6, borderRadius: '50%',
        background: `radial-gradient(circle, oklch(from ${color} l c h / 0.28) 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--ink)',
      }}>
        <span className="label" style={{ fontSize: 8.5, color: 'var(--gold-2)', opacity: 0.85, marginBottom: 1 }}>LEVEL</span>
        <span className="display" style={{
          fontFamily: 'var(--display)',
          fontWeight: 400, fontSize: size * 0.46, lineHeight: 1,
          color: 'var(--ink)',
        }}>{level}</span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Streak — small flame, dusty rose tint
// ──────────────────────────────────────────────────────────────
function StreakCounter({ days = 7 }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '5px 12px 5px 9px',
      background: 'oklch(from var(--rose) l c h / 0.10)',
      borderRadius: 'var(--r-pill)',
      border: '1px solid oklch(from var(--rose) l c h / 0.22)',
    }}>
      <Flame size={15} />
      <span className="display" style={{ fontSize: 14, color: 'var(--rose-2)', lineHeight: 1 }}>{days}</span>
      <span className="label" style={{ fontSize: 9, color: 'var(--rose-2)', opacity: 0.75 }}>days</span>
    </div>
  );
}

// Hand-drawn flame icon — single thin stroke
function Flame({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2.5 C 10 5.5, 7 6, 7 9.5 C 7 12, 8.7 13.5, 10 13.5 C 11.3 13.5, 13 12.2, 13 10.5 C 13 9, 12 8.5, 12 7.2 C 13.4 7.8, 15 9.4, 15 12 C 15 15, 12.8 17.2, 10 17.2 C 7.2 17.2, 5 15, 5 12 C 5 8, 8.5 6.5, 10 2.5 Z"
            stroke="var(--rose)" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// XP bar — single soft bar, no segments, gentle glow
// ──────────────────────────────────────────────────────────────
function XPBar({ current = 320, max = 400, animateFrom = null, height = 8 }) {
  const pct = Math.min(100, (current / max) * 100);
  const fromPct = animateFrom != null ? (animateFrom / max) * 100 : pct;
  return (
    <div>
      <div style={{
        position: 'relative', height,
        background: 'oklch(from var(--bg-3) l c h / 0.7)',
        borderRadius: 'var(--r-pill)',
        overflow: 'hidden',
      }}>
        <div className={animateFrom != null ? 'xp-fill' : ''} style={{
          position: 'absolute', top: 0, bottom: 0, left: 0,
          width: `${pct}%`,
          background: 'linear-gradient(90deg, oklch(from var(--teal) calc(l - 0.05) calc(c + 0.02) h) 0%, var(--gold) 100%)',
          borderRadius: 'var(--r-pill)',
          boxShadow: '0 0 12px oklch(from var(--gold) l c h / 0.30)',
          '--from': `${fromPct}%`, '--to': `${pct}%`,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
        <span className="body tnum" style={{ fontSize: 11.5, color: 'var(--ink-2)', letterSpacing: '0.02em' }}>
          {current} <span style={{ color: 'var(--ink-3)' }}>/ {max}</span>
        </span>
        <span className="label" style={{ fontSize: 9.5 }}>
          80 to level {Math.floor(current/max) + 4}
        </span>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Tier dot — small calligraphic accent (replaces shield)
// ──────────────────────────────────────────────────────────────
function TierDot({ tier = 1, size = 22, withLabel = true }) {
  const color = TIER_COLORS[tier];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, oklch(from ${color} calc(l + 0.05) c h) 0%, oklch(from ${color} calc(l - 0.10) c h) 100%)`,
        boxShadow: `0 0 0 3px oklch(from ${color} l c h / 0.10)`,
        flexShrink: 0,
      }} />
      {withLabel && (
        <span className="label" style={{ color: 'var(--ink-2)', fontSize: 9.5 }}>
          tier {tier} · {TIER_NAMES[tier]}
        </span>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// XP value — quiet inline, not a bold pill
// ──────────────────────────────────────────────────────────────
function XPValue({ amount = 5, tier = 1, size = 'md' }) {
  const color = TIER_COLORS[tier];
  const fs = size === 'sm' ? 11 : 13;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      color: 'var(--ink-2)',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: color, flexShrink: 0,
        boxShadow: `0 0 8px oklch(from ${color} l c h / 0.5)`,
      }} />
      <span className="body tnum" style={{ fontSize: fs, fontWeight: 600, letterSpacing: '0.01em' }}>
        +{amount} <span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>xp</span>
      </span>
    </span>
  );
}

// ──────────────────────────────────────────────────────────────
// Anime portrait — Ghibli-leaning, watercolor placeholder
// SAME CHARACTER through 6 stages: hidden → seeker → apprentice
// → adept → open → sage. Spiky dark hair w/ teal streak,
// almond eyes, gentle expression. Outfit/scene/lotus motif vary.
// All originals; not based on any copyrighted character.
// ──────────────────────────────────────────────────────────────

// Scene palettes per stage — sky/ground/accent tints
const STAGE = {
  hidden: {
    label: 'The Hidden',
    sky: ['oklch(48% 0.020 250)', 'oklch(36% 0.018 250)'],   // misty pre-dawn navy
    ground: 'oklch(28% 0.015 250)',
    fogTint: 'oklch(70% 0.015 250 / 0.45)',
    outfit: 'oklch(32% 0.012 250)',     // charcoal hooded cardigan
    outfitShade: 'oklch(22% 0.010 250)',
    hood: true,
    showLotus: false,
    expression: 'down',                  // gaze slightly lowered
    accent: 'oklch(72% 0.06 200)',       // teal streak only
  },
  seeker: {
    label: 'The Seeker',
    sky: ['oklch(82% 0.030 80)', 'oklch(74% 0.040 60)'],     // morning cream
    ground: 'oklch(60% 0.030 60)',
    fogTint: 'oklch(85% 0.025 70 / 0.30)',
    outfit: 'oklch(38% 0.030 250)',     // dusty navy cardigan
    outfitShade: 'oklch(28% 0.025 250)',
    inner: 'oklch(88% 0.020 80)',        // cream tee
    hood: false,
    showLotus: false,
    cafe: true,                          // tea on saucer
    expression: 'half-smile',
    accent: 'oklch(72% 0.06 200)',
  },
  apprentice: {
    label: 'The Apprentice',
    sky: ['oklch(70% 0.040 150)', 'oklch(56% 0.035 160)'],   // garden afternoon
    ground: 'oklch(48% 0.045 150)',
    fogTint: 'oklch(80% 0.030 150 / 0.25)',
    outfit: 'oklch(56% 0.060 200)',     // muted teal linen tunic
    outfitShade: 'oklch(42% 0.055 200)',
    collar: 'oklch(72% 0.040 200)',
    hood: false,
    showLotus: 'pin',                    // enamel pin at collar
    wisteria: true,
    expression: 'calm',
    accent: 'oklch(72% 0.06 200)',
  },
  adept: {
    label: 'The Adept',
    sky: ['oklch(72% 0.080 60)', 'oklch(56% 0.080 40)'],     // golden hour
    ground: 'oklch(50% 0.060 50)',
    fogTint: 'oklch(80% 0.060 60 / 0.30)',
    outfit: 'oklch(38% 0.060 260)',     // indigo open-collar shirt
    outfitShade: 'oklch(28% 0.055 260)',
    inner: 'oklch(88% 0.020 80)',        // cream undershirt
    hood: false,
    showLotus: 'pin',
    market: true,                        // soft figures behind
    journal: true,                       // tucked under arm
    expression: 'warm',
    accent: 'oklch(72% 0.06 200)',
  },
  open: {
    label: 'The Open',
    sky: ['oklch(86% 0.040 30)', 'oklch(78% 0.035 50)'],     // dawn pink-cream
    ground: 'oklch(72% 0.030 100)',
    fogTint: 'oklch(90% 0.025 30 / 0.35)',
    outfit: 'oklch(85% 0.025 80)',       // cream cotton robe
    outfitShade: 'oklch(70% 0.025 80)',
    accent2: 'oklch(60% 0.060 200)',     // teal trim
    hood: false,
    showLotus: 'tattoo',                 // small tattoo behind ear
    palmsOpen: true,
    grasses: true,
    expression: 'open',                  // soft direct gaze
    accent: 'oklch(72% 0.06 200)',
  },
  sage: {
    label: 'The Sage',
    sky: ['oklch(78% 0.090 60)', 'oklch(58% 0.080 40)'],     // sunset gold
    ground: 'oklch(40% 0.040 30)',
    fogTint: 'oklch(80% 0.060 50 / 0.35)',
    outfit: 'oklch(48% 0.040 30)',       // warm sunset robe
    outfitShade: 'oklch(36% 0.040 30)',
    hood: false,
    showLotus: 'tattoo-bloom',           // fully bloomed tattoo
    teacup: true,
    porch: true,
    mountains: true,
    petals: true,
    expression: 'eyes-half',             // eyes half-closed, soft smile
    accent: 'oklch(72% 0.04 200 / 0.5)', // teal streak fading
  },
};

// Backwards-compat: legacy variant names map to new stages
const VARIANT_ALIAS = { voice: 'adept', luminary: 'open' };

function AnimePortrait({ tier = 1, locked = false, size = 120, variant = 'apprentice', gender = 'male' }) {
  const v = VARIANT_ALIAS[variant] || variant;
  const stage = STAGE[v] || STAGE.apprentice;
  const skin = 'oklch(86% 0.040 60)';
  const skinShade = 'oklch(74% 0.045 50)';
  const hair = 'oklch(28% 0.018 260)';      // shoulder-length spiky dark
  const hairLight = 'oklch(38% 0.020 260)';
  const tealStreak = stage.accent;
  const cardId = `${v}-${tier}-${gender}-${Math.floor(size)}`;
  // Female: softer jaw (smaller face oval), slightly fuller lips, longer eyelashes,
  // softer chest line in body; Male: square jaw, flatter chest line.
  const isF = gender === 'female';
  const faceRx = isF ? 13 : 14;
  const faceRy = isF ? 16.2 : 16;
  const lipBoldness = isF ? 0.95 : 0.7;

  return (
    <svg width={size} height={size * 1.20} viewBox="0 0 100 120"
         style={{ filter: locked ? 'grayscale(0.7) brightness(0.55) saturate(0.6)' : 'none', display: 'block' }}>
      <defs>
        {/* Watercolor sky/ground gradient — different per stage */}
        <linearGradient id={`sky-${cardId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={stage.sky[0]} />
          <stop offset="60%" stopColor={stage.sky[1]} />
          <stop offset="100%" stopColor={stage.ground} stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={`light-${cardId}`} cx="65%" cy="30%" r="70%">
          <stop offset="0%" stopColor="oklch(95% 0.040 80 / 0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id={`outfit-${cardId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stage.outfit} />
          <stop offset="100%" stopColor={stage.outfitShade} />
        </linearGradient>
        <linearGradient id={`hair-${cardId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hairLight} />
          <stop offset="100%" stopColor={hair} />
        </linearGradient>
        {/* watercolor texture noise via radial spots */}
        <radialGradient id={`wash-${cardId}`} cx="30%" cy="40%" r="80%">
          <stop offset="0%" stopColor="oklch(95% 0.020 80 / 0.10)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* painterly watercolor filter — soft brush strokes, deckled edges */}
        <filter id={`paint-${cardId}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={tier * 7 + (isF ? 3 : 1)} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" xChannelSelector="R" yChannelSelector="G" result="dist" />
          <feGaussianBlur in="dist" stdDeviation="0.18" />
        </filter>
        {/* heavier wash filter for backdrop only */}
        <filter id={`wash-fx-${cardId}`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed={tier * 11} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>

      {/* SCENE: watercolor backdrop */}
      <g filter={`url(#wash-fx-${cardId})`}>
      <rect x="0" y="0" width="100" height="120" fill={`url(#sky-${cardId})`} />
      <rect x="0" y="0" width="100" height="120" fill={`url(#light-${cardId})`} />

      {/* Stage-specific scene elements (BEHIND character) */}
      {v === 'hidden' && (
        <>
          {/* misty trees suggested */}
          <ellipse cx="20" cy="78" rx="14" ry="22" fill="oklch(35% 0.012 250 / 0.55)" />
          <ellipse cx="80" cy="80" rx="16" ry="24" fill="oklch(30% 0.012 250 / 0.6)" />
          {/* lantern hint */}
          <circle cx="78" cy="62" r="1.6" fill="oklch(82% 0.060 80 / 0.5)" />
          <line x1="78" y1="63" x2="78" y2="76" stroke="oklch(25% 0.010 250 / 0.7)" strokeWidth="0.4" />
          {/* fog wash */}
          <rect x="0" y="65" width="100" height="55" fill={stage.fogTint} />
          <ellipse cx="50" cy="98" rx="60" ry="14" fill="oklch(65% 0.012 250 / 0.30)" />
        </>
      )}
      {v === 'seeker' && (
        <>
          {/* window frame implied */}
          <rect x="3" y="22" width="40" height="60" rx="2" fill="oklch(80% 0.030 80 / 0.35)" />
          <rect x="3" y="22" width="40" height="60" rx="2" fill="none" stroke="oklch(50% 0.025 50 / 0.4)" strokeWidth="0.6" />
          <line x1="23" y1="22" x2="23" y2="82" stroke="oklch(50% 0.025 50 / 0.35)" strokeWidth="0.4" />
          {/* street suggestion */}
          <ellipse cx="20" cy="58" rx="10" ry="18" fill="oklch(70% 0.025 80 / 0.4)" />
          {/* table edge */}
          <rect x="0" y="98" width="100" height="22" fill="oklch(50% 0.040 50 / 0.7)" />
        </>
      )}
      {v === 'apprentice' && (
        <>
          {/* garden wall */}
          <rect x="0" y="0" width="100" height="50" fill="oklch(56% 0.035 150 / 0.45)" />
          {/* wisteria blossoms — drifting blobs */}
          <ellipse cx="14" cy="20" rx="4" ry="6" fill="oklch(75% 0.040 320 / 0.5)" />
          <ellipse cx="84" cy="14" rx="3" ry="5" fill="oklch(75% 0.040 320 / 0.5)" />
          <ellipse cx="92" cy="36" rx="2.5" ry="4" fill="oklch(75% 0.040 320 / 0.45)" />
          <ellipse cx="8"  cy="42" rx="2.5" ry="4" fill="oklch(75% 0.040 320 / 0.4)" />
          {/* afternoon light wash */}
          <ellipse cx="70" cy="20" rx="40" ry="20" fill="oklch(90% 0.040 80 / 0.20)" />
        </>
      )}
      {v === 'adept' && (
        <>
          {/* market figures — soft suggested silhouettes */}
          <ellipse cx="14" cy="74" rx="6" ry="14" fill="oklch(40% 0.040 50 / 0.45)" />
          <ellipse cx="86" cy="76" rx="7" ry="15" fill="oklch(38% 0.045 50 / 0.5)" />
          <ellipse cx="6"  cy="82" rx="4" ry="10" fill="oklch(42% 0.040 50 / 0.4)" />
          <ellipse cx="94" cy="84" rx="5" ry="11" fill="oklch(38% 0.040 50 / 0.45)" />
          {/* warm sun haze */}
          <ellipse cx="80" cy="22" rx="22" ry="14" fill="oklch(90% 0.080 70 / 0.45)" />
          <ellipse cx="80" cy="22" rx="10" ry="6" fill="oklch(95% 0.060 80 / 0.55)" />
        </>
      )}
      {v === 'open' && (
        <>
          {/* dawn hilltop */}
          <ellipse cx="50" cy="105" rx="80" ry="18" fill="oklch(72% 0.030 100 / 0.7)" />
          {/* grass strokes */}
          {[12, 24, 78, 88].map((x, i) => (
            <path key={i} d={`M${x} 100 Q ${x+1} 94, ${x+0.5} 88`}
                  stroke="oklch(60% 0.040 130 / 0.6)" strokeWidth="0.5" fill="none" />
          ))}
          {/* drifting cherry petals */}
          <ellipse cx="18" cy="32" rx="1.5" ry="2.2" fill="oklch(85% 0.040 20 / 0.7)" transform="rotate(20 18 32)" />
          <ellipse cx="82" cy="42" rx="1.4" ry="2"   fill="oklch(85% 0.040 20 / 0.6)" transform="rotate(-15 82 42)" />
          <ellipse cx="88" cy="68" rx="1.3" ry="1.9" fill="oklch(85% 0.040 20 / 0.55)" transform="rotate(30 88 68)" />
        </>
      )}
      {v === 'sage' && (
        <>
          {/* mountains in mist */}
          <path d="M0 70 L 18 56 L 32 64 L 48 50 L 62 60 L 78 52 L 100 66 L 100 80 L 0 80 Z"
                fill="oklch(50% 0.030 50 / 0.5)" />
          <path d="M0 76 L 22 66 L 40 72 L 58 64 L 74 70 L 100 62 L 100 84 L 0 84 Z"
                fill="oklch(45% 0.030 30 / 0.6)" />
          {/* porch railing */}
          <rect x="0" y="92" width="100" height="3" fill="oklch(38% 0.040 30 / 0.85)" />
          <rect x="0" y="106" width="100" height="14" fill="oklch(34% 0.040 30 / 0.95)" />
          {/* sunset glow */}
          <ellipse cx="78" cy="48" rx="22" ry="10" fill="oklch(90% 0.080 50 / 0.45)" />
          {/* drifting petals */}
          <ellipse cx="14" cy="28" rx="1.4" ry="2" fill="oklch(80% 0.060 20 / 0.6)" transform="rotate(20 14 28)" />
          <ellipse cx="88" cy="36" rx="1.3" ry="1.9" fill="oklch(82% 0.060 20 / 0.55)" transform="rotate(-20 88 36)" />
          <ellipse cx="22" cy="58" rx="1.2" ry="1.7" fill="oklch(80% 0.060 20 / 0.5)" transform="rotate(35 22 58)" />
        </>
      )}

      {/* watercolor wash overlay */}
      <rect x="0" y="0" width="100" height="120" fill={`url(#wash-${cardId})`} />
      </g>

      {/* ─── CHARACTER ─── (consistent across stages) */}
      <g filter={`url(#paint-${cardId})`}>

      {/* Body / outfit */}
      {v === 'hidden' && (
        // heavy hooded cardigan, hands tucked
        <>
          <path d="M14 120 Q 14 86, 30 76 Q 36 72, 38 70 L 62 70 Q 64 72, 70 76 Q 86 86, 86 120 Z"
                fill={`url(#outfit-${cardId})`} />
          {/* hood up — covers part of head */}
          <path d="M28 50 Q 28 30, 50 28 Q 72 30, 72 50 Q 72 60, 68 62 Q 60 56, 50 56 Q 40 56, 32 62 Q 28 60, 28 50 Z"
                fill={`url(#outfit-${cardId})`} />
          {/* hood inner shadow on face */}
          <ellipse cx="50" cy="56" rx="14" ry="6" fill="oklch(20% 0.010 250 / 0.55)" />
          {/* sleeve seams */}
          <path d="M30 88 Q 38 86, 40 92" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.7" />
          <path d="M70 88 Q 62 86, 60 92" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.7" />
        </>
      )}
      {v === 'seeker' && (
        <>
          {/* cardigan over cream tee */}
          <path d="M16 120 Q 18 84, 32 76 L 38 72 L 62 72 L 68 76 Q 82 84, 84 120 Z"
                fill={`url(#outfit-${cardId})`} />
          {/* cream tee triangle */}
          <path d="M42 76 L 50 86 L 58 76 Z" fill={stage.inner} />
          {/* cardigan opening */}
          <path d="M44 76 L 50 92 M 56 76 L 50 92" stroke={stage.outfitShade} strokeWidth="0.5" opacity="0.6" />
          {/* tea cup on table */}
          <ellipse cx="20" cy="106" rx="8" ry="2" fill="oklch(80% 0.020 80 / 0.85)" />
          <path d="M14 106 Q 14 100, 18 100 L 22 100 Q 26 100, 26 106 Z" fill="oklch(85% 0.020 80)" />
          <ellipse cx="20" cy="100" rx="4" ry="1" fill="oklch(40% 0.040 40 / 0.85)" />
          {/* cherry petal on saucer */}
          <ellipse cx="22" cy="106.5" rx="0.8" ry="1.2" fill="oklch(82% 0.060 20)" transform="rotate(20 22 106.5)" />
        </>
      )}
      {v === 'apprentice' && (
        <>
          {/* linen tunic */}
          <path d="M16 120 Q 18 84, 32 76 L 38 72 L 62 72 L 68 76 Q 82 84, 84 120 Z"
                fill={`url(#outfit-${cardId})`} />
          {/* embroidered collar line */}
          <path d="M40 73 Q 50 78, 60 73" stroke={stage.collar} strokeWidth="0.7" fill="none" />
          <path d="M42 76 Q 50 80, 58 76" stroke={stage.collar} strokeWidth="0.4" fill="none" opacity="0.7" />
          {/* enamel lotus pin at collar */}
          <circle cx="58" cy="78" r="1.6" fill="oklch(78% 0.080 60)" stroke="oklch(40% 0.030 40)" strokeWidth="0.3" />
          <path d="M58 76.6 L 58.5 78 L 58 79.4 L 57.5 78 Z" fill="oklch(95% 0.030 80 / 0.7)" />
        </>
      )}
      {v === 'adept' && (
        <>
          {/* indigo open-collar shirt over cream */}
          <path d="M16 120 Q 18 84, 32 76 L 38 72 L 62 72 L 68 76 Q 82 84, 84 120 Z"
                fill={`url(#outfit-${cardId})`} />
          {/* cream undershirt v */}
          <path d="M42 74 L 50 90 L 58 74 Z" fill={stage.inner} />
          {/* journal under arm */}
          <rect x="68" y="92" width="14" height="18" rx="0.5" fill="oklch(40% 0.045 50)" />
          <rect x="68" y="92" width="14" height="18" rx="0.5" fill="none" stroke="oklch(28% 0.040 50)" strokeWidth="0.4" />
          <line x1="68" y1="98" x2="82" y2="98" stroke="oklch(28% 0.040 50 / 0.6)" strokeWidth="0.3" />
          {/* lotus pin */}
          <circle cx="42" cy="78" r="1.4" fill="oklch(78% 0.080 60)" stroke="oklch(40% 0.030 40)" strokeWidth="0.3" />
        </>
      )}
      {v === 'open' && (
        <>
          {/* flowing cotton robe, sleeves drift */}
          <path d="M10 120 Q 14 88, 28 78 Q 35 73, 40 70 L 60 70 Q 65 73, 72 78 Q 86 88, 90 120 Z"
                fill={`url(#outfit-${cardId})`} />
          {/* teal trim along opening */}
          <path d="M50 70 L 50 120" stroke={stage.accent2} strokeWidth="0.6" opacity="0.7" />
          <path d="M48 72 Q 50 75, 52 72" stroke={stage.accent2} strokeWidth="0.5" fill="none" />
          {/* drifting sleeve hint */}
          <path d="M14 96 Q 6 100, 8 110" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.6" />
          <path d="M86 96 Q 94 100, 92 110" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.6" />
          {/* PALMS OPEN — visible hands at sides */}
          <ellipse cx="20" cy="98" rx="3.6" ry="4.2" fill={skin} />
          <ellipse cx="80" cy="98" rx="3.6" ry="4.2" fill={skin} />
          <path d="M18 96 L 18 100 M 20 95.5 L 20 100.5 M 22 96 L 22 100"
                stroke={skinShade} strokeWidth="0.3" opacity="0.7" />
          <path d="M78 96 L 78 100 M 80 95.5 L 80 100.5 M 82 96 L 82 100"
                stroke={skinShade} strokeWidth="0.3" opacity="0.7" />
        </>
      )}
      {v === 'sage' && (
        <>
          {/* sitting cross-legged — robe drapes wide */}
          <path d="M8 120 Q 12 90, 28 80 L 38 74 L 62 74 L 72 80 Q 88 90, 92 120 Z"
                fill={`url(#outfit-${cardId})`} />
          {/* fold lines */}
          <path d="M30 100 Q 50 96, 70 100" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.7" />
          <path d="M22 110 Q 50 106, 78 110" stroke={stage.outfitShade} strokeWidth="0.4" fill="none" opacity="0.6" />
          {/* hands holding teacup */}
          <ellipse cx="42" cy="92" rx="4" ry="3" fill={skin} />
          <ellipse cx="58" cy="92" rx="4" ry="3" fill={skin} />
          {/* teacup */}
          <path d="M44 88 Q 44 84, 48 84 L 52 84 Q 56 84, 56 88 L 56 92 Q 56 96, 50 96 Q 44 96, 44 92 Z"
                fill="oklch(82% 0.025 60)" stroke="oklch(50% 0.040 40)" strokeWidth="0.4" />
          <ellipse cx="50" cy="86" rx="4" ry="0.7" fill="oklch(45% 0.060 40 / 0.8)" />
          {/* steam */}
          <path d="M48 82 Q 49 79, 48 76 M 52 82 Q 53 79, 52 76"
                stroke="oklch(85% 0.020 80 / 0.5)" strokeWidth="0.5" fill="none" />
          {/* journal beside */}
          <rect x="76" y="106" width="16" height="6" rx="0.5" fill="oklch(38% 0.045 50)" />
          <line x1="84" y1="106" x2="84" y2="112" stroke="oklch(28% 0.040 50)" strokeWidth="0.3" />
        </>
      )}

      {/* NECK */}
      {v !== 'hidden' && (
        <>
          <path d="M44 64 L 44 72 Q 50 76, 56 72 L 56 64 Z" fill={skin} />
          <path d="M44 70 Q 50 73, 56 70" stroke={skinShade} strokeWidth="0.4" fill="none" opacity="0.6" />
        </>
      )}

      {/* BACK HAIR — shoulder-length, spiky/jagged silhouette */}
      {v !== 'hidden' && (
        <path d="M28 38 Q 26 28, 32 22 Q 38 17, 44 18 Q 47 16, 50 17 Q 53 16, 56 18 Q 62 17, 68 22 Q 74 28, 72 38 Q 76 50, 74 62
                 L 72 70 L 70 64 L 67 72 L 64 66 L 61 74 L 58 68
                 L 60 56 Q 60 50, 58 46 L 42 46 Q 40 50, 40 56 L 42 68
                 L 39 74 L 36 66 L 33 72 L 30 64 L 28 70 L 26 62 Q 24 50, 28 38 Z"
              fill={`url(#hair-${cardId})`} />
      )}

      {/* FACE */}
      {v !== 'hidden' && (
        <>
          <ellipse cx="50" cy="50" rx={faceRx} ry={faceRy} fill={skin} />
          {/* soft cheek wash */}
          <ellipse cx={50 - (isF ? 7.5 : 8)} cy="55" rx="2.8" ry="1.3" fill="oklch(80% 0.05 30 / 0.6)" />
          <ellipse cx={50 + (isF ? 7.5 : 8)} cy="55" rx="2.8" ry="1.3" fill="oklch(80% 0.05 30 / 0.6)" />
          {/* jaw shading — softer for female, sharper for male */}
          {isF ? (
            <>
              <path d="M38 56 Q 39.5 62, 44 64" stroke={skinShade} strokeWidth="0.25" fill="none" opacity="0.4" />
              <path d="M62 56 Q 60.5 62, 56 64" stroke={skinShade} strokeWidth="0.25" fill="none" opacity="0.4" />
            </>
          ) : (
            <>
              <path d="M37 55 Q 38 62, 45 65" stroke={skinShade} strokeWidth="0.4" fill="none" opacity="0.55" />
              <path d="M63 55 Q 62 62, 55 65" stroke={skinShade} strokeWidth="0.4" fill="none" opacity="0.55" />
              {/* subtle chin definition */}
              <path d="M47 64 Q 50 65.5, 53 64" stroke={skinShade} strokeWidth="0.3" fill="none" opacity="0.45" />
            </>
          )}
        </>
      )}

      {/* Hidden: face shown but in hood-shadow */}
      {v === 'hidden' && (
        <>
          <ellipse cx="50" cy="52" rx="11" ry="13" fill={skin} opacity="0.85" />
          {/* shadow from hood */}
          <ellipse cx="50" cy="46" rx="13" ry="6" fill="oklch(15% 0.010 250 / 0.55)" />
          <ellipse cx="50" cy="58" rx="2" ry="1" fill="oklch(80% 0.05 30 / 0.4)" />
        </>
      )}

      {/* FRONT HAIR / SPIKY BANGS — 5 distinct triangular points with negative space */}
      {v !== 'hidden' && (
        <>
          {/* base hair line above forehead */}
          <path d="M34 38 L 34 36 Q 34 34, 36 34
                   L 38 28 L 41 36
                   L 43 26 L 46 35
                   L 48 24 L 51 35
                   L 54 25 L 57 35
                   L 60 27 L 62 35
                   L 64 30 L 66 36
                   Q 66 34, 66 38 Z"
                fill={`url(#hair-${cardId})`} />
          {/* TEAL STREAK — wider, runs vertically through one front spike */}
          <path d="M40 38 L 40 36 L 40.5 30 L 41.5 26 L 43 30 L 43 38 Z"
                fill={tealStreak} opacity={v === 'sage' ? 0.42 : 0.92} />
          {/* highlight on streak */}
          <path d="M41 36 L 41 30 L 41.7 28 L 42 32 L 42 36 Z"
                fill={`oklch(from ${tealStreak} calc(l + 0.10) c h)`} opacity={v === 'sage' ? 0.3 : 0.7} />
          {/* sideburn hint */}
          <path d="M36 42 Q 36 50, 38 56" stroke={hair} strokeWidth="0.6" fill="none" opacity="0.7" />
          <path d="M64 42 Q 64 50, 62 56" stroke={hair} strokeWidth="0.6" fill="none" opacity="0.7" />
          {/* one stray strand for life */}
          <path d="M52 26 Q 52 30, 51 34" stroke={hair} strokeWidth="0.5" fill="none" opacity="0.7" />
        </>
      )}

      {/* EYES — almond-shaped, soft thoughtful (varies by expression) */}
      {!locked && v !== 'hidden' && (
        <>
          {(() => {
            // expression knobs
            const eyeOpenY = stage.expression === 'eyes-half' ? 1.7 : 2.5;
            const browTilt = stage.expression === 'down' ? 0.3
                            : stage.expression === 'open' ? -0.3 : 0;
            const lookY = stage.expression === 'down' ? 0.6 : 0;
            return (
              <>
                {/* almond eye whites — wider */}
                <path d={`M40.5 ${50.5+lookY} Q 44.5 ${48.6+lookY-0.5}, 48.5 ${50.5+lookY} Q 44.5 ${52.8+lookY}, 40.5 ${50.5+lookY} Z`} fill="white" opacity="0.94" />
                <path d={`M51.5 ${50.5+lookY} Q 55.5 ${48.6+lookY-0.5}, 59.5 ${50.5+lookY} Q 55.5 ${52.8+lookY}, 51.5 ${50.5+lookY} Z`} fill="white" opacity="0.94" />
                {/* iris — soft brown */}
                <ellipse cx="44.5" cy={50.8+lookY} rx="2.0" ry={eyeOpenY} fill="oklch(35% 0.040 60)" />
                <ellipse cx="55.5" cy={50.8+lookY} rx="2.0" ry={eyeOpenY} fill="oklch(35% 0.040 60)" />
                {/* iris highlight */}
                <ellipse cx="44.5" cy={51+lookY} rx="1.6" ry={Math.max(eyeOpenY-0.4, 1.2)}
                         fill={`oklch(from ${stage.accent} calc(l - 0.20) c h)`} opacity="0.55" />
                <ellipse cx="55.5" cy={51+lookY} rx="1.6" ry={Math.max(eyeOpenY-0.4, 1.2)}
                         fill={`oklch(from ${stage.accent} calc(l - 0.20) c h)`} opacity="0.55" />
                {/* pupil */}
                <ellipse cx="44.5" cy={51.2+lookY} rx="1.0" ry={Math.min(eyeOpenY-0.3, 1.9)} fill="oklch(15% 0.015 250)" />
                <ellipse cx="55.5" cy={51.2+lookY} rx="1.0" ry={Math.min(eyeOpenY-0.3, 1.9)} fill="oklch(15% 0.015 250)" />
                {/* shine — bigger */}
                <circle cx="45.3" cy={49.8+lookY} r="0.7" fill="white" />
                <circle cx="56.3" cy={49.8+lookY} r="0.7" fill="white" />
                <circle cx="44.0" cy={51.6+lookY} r="0.3" fill="white" opacity="0.7" />
                <circle cx="55.0" cy={51.6+lookY} r="0.3" fill="white" opacity="0.7" />
                {/* upper lash — almond curve, longer/thicker for female */}
                <path d={`M40.5 ${49.5+lookY} Q 44.5 ${47.8+lookY-0.4}, 48.5 ${49.5+lookY}`}
                      stroke="oklch(20% 0.015 250)" strokeWidth={isF ? 1.1 : 0.8} fill="none" strokeLinecap="round" />
                <path d={`M51.5 ${49.5+lookY} Q 55.5 ${47.8+lookY-0.4}, 59.5 ${49.5+lookY}`}
                      stroke="oklch(20% 0.015 250)" strokeWidth={isF ? 1.1 : 0.8} fill="none" strokeLinecap="round" />
                {/* female: outer lash flick */}
                {isF && (
                  <>
                    <path d={`M48 ${49.4+lookY} Q 49.2 ${48.4+lookY}, 50 ${48.0+lookY}`} stroke="oklch(20% 0.015 250)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                    <path d={`M52 ${49.4+lookY} Q 50.8 ${48.4+lookY}, 50 ${48.0+lookY}`} stroke="oklch(20% 0.015 250)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
                  </>
                )}
                {/* eyebrows — soft, slightly higher */}
                <path d={`M40 ${44.6+browTilt} Q 44 ${43.6+browTilt-0.2}, 48.5 ${44.4+browTilt}`}
                      stroke={hair} strokeWidth="0.85" fill="none" strokeLinecap="round" opacity="0.88" />
                <path d={`M51.5 ${44.4+browTilt} Q 55.5 ${43.6+browTilt-0.2}, 60 ${44.6+browTilt}`}
                      stroke={hair} strokeWidth="0.85" fill="none" strokeLinecap="round" opacity="0.88" />
                {/* eyes-half — eyelid line for sage */}
                {stage.expression === 'eyes-half' && (
                  <>
                    <path d="M40.5 50 Q 44.5 50.6, 48.5 50" stroke={hair} strokeWidth="0.7" fill="none" />
                    <path d="M51.5 50 Q 55.5 50.6, 59.5 50" stroke={hair} strokeWidth="0.7" fill="none" />
                  </>
                )}
              </>
            );
          })()}
        </>
      )}

      {/* NOSE — Ghibli minimal */}
      {v !== 'hidden' && (
        <path d="M49.5 56 Q 50 57.2, 50.5 56" stroke={skinShade} strokeWidth="0.4" fill="none" strokeLinecap="round" />
      )}

      {/* MOUTH — varies by expression */}
      {v !== 'hidden' && (
        <>
          {stage.expression === 'half-smile' && (
            <path d="M47.8 60 Q 50 61.2, 52.4 60.2" stroke="oklch(45% 0.06 25)" strokeWidth={lipBoldness} fill="none" strokeLinecap="round" />
          )}
          {stage.expression === 'calm' && (
            <path d="M48 60.4 Q 50 61, 52 60.4" stroke="oklch(45% 0.06 25)" strokeWidth={lipBoldness} fill="none" strokeLinecap="round" />
          )}
          {stage.expression === 'warm' && (
            <path d="M47.2 60 Q 50 61.6, 52.8 60" stroke="oklch(45% 0.06 25)" strokeWidth={lipBoldness} fill="none" strokeLinecap="round" />
          )}
          {stage.expression === 'open' && (
            <path d="M47.6 60.2 Q 50 61.4, 52.4 60.2" stroke="oklch(45% 0.06 25)" strokeWidth={lipBoldness} fill="none" strokeLinecap="round" />
          )}
          {stage.expression === 'eyes-half' && (
            <path d="M47.6 60 Q 50 61.4, 52.4 60" stroke="oklch(45% 0.06 25)" strokeWidth={lipBoldness} fill="none" strokeLinecap="round" />
          )}
          {stage.expression === 'down' && (
            <path d="M48.4 60.4 Q 50 60.6, 51.6 60.4" stroke="oklch(45% 0.06 25)" strokeWidth={Math.max(lipBoldness - 0.1, 0.55)} fill="none" strokeLinecap="round" />
          )}
          {/* female: subtle upper-lip dab adds fullness */}
          {isF && stage.expression !== 'down' && (
            <ellipse cx="50" cy="59.5" rx="1.4" ry="0.35" fill="oklch(70% 0.07 25 / 0.45)" />
          )}
        </>
      )}

      {/* LOTUS TATTOO — behind ear, soft */}
      {stage.showLotus === 'tattoo' && (
        <path d="M62 53 L 62.5 51 L 63.5 51.5 L 63 53 L 64 52.5 L 63.8 53.6 L 62.8 53.4 Z"
              fill="oklch(40% 0.040 320 / 0.55)" />
      )}
      {stage.showLotus === 'tattoo-bloom' && (
        <>
          {/* fully bloomed lotus behind ear */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <ellipse key={i} cx="63" cy="53" rx="0.6" ry="1.6"
                     fill="oklch(45% 0.045 320 / 0.65)"
                     transform={`rotate(${deg} 63 53)`} />
          ))}
          <circle cx="63" cy="53" r="0.5" fill="oklch(75% 0.060 60 / 0.7)" />
        </>
      )}

      {/* watercolor edge softening */}
      <rect x="0" y="0" width="100" height="120" fill="oklch(80% 0.020 80 / 0.04)" />
      </g>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// Avatar circular frame (home)
// ──────────────────────────────────────────────────────────────
function AvatarFrame({ tier = 3, size = 76, label = 'The Apprentice', variant = 'apprentice', gender = 'male' }) {
  const color = TIER_COLORS[tier];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'var(--bg-3)',
        border: `1px solid oklch(from ${color} l c h / 0.55)`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 0 4px var(--bg), 0 0 28px oklch(from ${color} l c h / 0.22)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          overflow: 'hidden', borderRadius: '50%',
        }}>
          <AnimePortrait tier={tier} size={size * 0.95} variant={variant} gender={gender} />
        </div>
      </div>
      <div>
        <div className="label" style={{ color: 'var(--gold-2)', opacity: 0.85 }}>equipped</div>
        <div className="display" style={{ fontSize: 22, color: 'var(--ink)', marginTop: 2, letterSpacing: '0.005em' }}>{label}</div>
        <div style={{ marginTop: 6 }}><TierDot tier={tier} size={10} /></div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Tab navigation — thin line icons, hand-drawn underline for active
// ──────────────────────────────────────────────────────────────
function TabNav({ active = 'home', onChange }) {
  const tabs = [
    { id: 'home',       label: 'Home',       icon: HomeIcon },
    { id: 'challenges', label: 'Challenges', icon: ScrollIcon },
    { id: 'coach',      label: 'Sensei',     icon: ChatIcon },
    { id: 'profile',    label: 'Self',       icon: AvatarIcon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 26, paddingTop: 14,
      background: 'oklch(from var(--bg) l c h / 0.78)',
      borderTop: '1px solid oklch(from var(--line) l c h / 0.5)',
      backdropFilter: 'blur(20px) saturate(1.1)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.1)',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = t.id === active;
        return (
          <button key={t.id}
                  onClick={() => onChange && onChange(t.id)}
                  className="tap"
                  style={{
                    padding: '4px 12px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    color: isActive ? 'var(--gold-2)' : 'var(--ink-3)',
                  }}>
            <Icon active={isActive} />
            <span className={isActive ? 'handline' : ''} style={{
              fontFamily: 'var(--display)',
              fontStyle: 'italic',
              fontSize: 13,
              letterSpacing: '0.01em',
              color: isActive ? 'var(--ink)' : 'var(--ink-3)',
              fontWeight: 400,
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Hand-drawn line iconography — thin strokes, organic
// ──────────────────────────────────────────────────────────────
function HomeIcon({ active }) {
  const c = active ? 'var(--gold-2)' : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3.2 10.4 Q 11 3.6, 18.8 10.4" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5 10 L 5 18.5 L 17 18.5 L 17 10" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 18.5 L 9 13.5 L 13 13.5 L 13 18.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function ScrollIcon({ active }) {
  const c = active ? 'var(--gold-2)' : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M5 4.5 Q 4.5 4.5, 4.5 5 L 4.5 17 Q 4.5 17.5, 5 17.5 L 17 17.5 Q 17.5 17.5, 17.5 17 L 17.5 5 Q 17.5 4.5, 17 4.5 Z"
            stroke={c} strokeWidth="1.2" />
      <path d="M7.5 8.5 H 14.5 M 7.5 11.5 H 13 M 7.5 14.5 H 11" stroke={c} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function ChatIcon({ active }) {
  const c = active ? 'var(--gold-2)' : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 6.5 Q 4 5, 5.5 5 L 16.5 5 Q 18 5, 18 6.5 L 18 13.5 Q 18 15, 16.5 15 L 11 15 L 7.5 18 L 7.5 15 L 5.5 15 Q 4 15, 4 13.5 Z"
            stroke={c} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
function AvatarIcon({ active }) {
  const c = active ? 'var(--gold-2)' : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8.5" r="3" stroke={c} strokeWidth="1.2" />
      <path d="M4.5 18.5 Q 4.5 13, 11 13 Q 17.5 13, 17.5 18.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      <path d="M5 3.5 L 9 7 L 5 10.5" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Sparkle({ size = 14, color = 'var(--gold-2)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5 L 7.6 6.4 L 12.5 7 L 7.6 7.6 L 7 12.5 L 6.4 7.6 L 1.5 7 L 6.4 6.4 Z"
            fill={color} opacity="0.85" />
    </svg>
  );
}

function PaperCrane({ size = 22, color = 'var(--teal)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <path d="M3 4 Q 11 8, 19 5 L 13 11 L 19 5 L 16 14 L 13 11 L 11 18 L 13 11 L 7 13 L 3 4 Z"
            stroke={color} strokeWidth="1" strokeLinejoin="round" fill="none" />
      <path d="M3 4 L 13 11 L 11 18" stroke={color} strokeWidth="1" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Leaf({ size = 14, color = 'var(--teal)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M2 12 Q 2 4, 12 2 Q 11 10, 2 12 Z" stroke={color} strokeWidth="1" strokeLinejoin="round" />
      <path d="M2 12 Q 5 9, 9 5" stroke={color} strokeWidth="0.7" />
    </svg>
  );
}

function Moon({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M11 2 Q 5 4, 5 8 Q 5 12, 11 14 Q 6 13, 6 8 Q 6 3, 11 2 Z" fill={color} opacity="0.9" />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────────
// Soft card surface — replaces NotchedCard, no chamfers
// ──────────────────────────────────────────────────────────────
function SoftCard({ children, padding = 16, glow = false, style = {}, onClick, radius = 'var(--r-md)' }) {
  return (
    <div onClick={onClick}
         className={onClick ? 'tap' : ''}
         style={{
           background: 'var(--bg-2)',
           border: '1px solid var(--line)',
           borderRadius: radius,
           padding,
           position: 'relative',
           ...(glow ? {
             boxShadow: 'inset 0 0 0 1px oklch(from var(--gold) l c h / 0.5), 0 0 28px oklch(from var(--gold) l c h / 0.16)',
           } : {}),
           ...style,
         }}>
      {children}
    </div>
  );
}

// Drifting dust motes / petals layer
function DustMotes({ count = 14, color = 'oklch(85% 0.02 80 / 0.45)', kind = 'mote' }) {
  const motes = React.useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      left: `${(i * 37 + 13) % 100}%`,
      size: 2 + ((i * 7) % 4),
      dx: -20 + ((i * 13) % 50),
      dur: 14 + ((i * 5) % 12),
      delay: -((i * 1.7) % 16),
    })), [count]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {motes.map((m, i) => (
        <span key={i}
              className={kind === 'petal' ? 'petal' : 'mote'}
              style={{
                left: m.left,
                top: '-20px',
                width: m.size,
                height: m.size,
                background: kind === 'mote' ? color : 'transparent',
                '--dx': `${m.dx}px`,
                '--dur': `${m.dur}s`,
                '--delay': `${m.delay}s`,
              }}>
          {kind === 'petal' && (
            <svg width={m.size * 4} height={m.size * 4} viewBox="0 0 14 14" style={{ display: 'block' }}>
              <path d="M7 1 Q 12 4, 11 8 Q 9 13, 7 13 Q 5 13, 3 8 Q 2 4, 7 1 Z" fill={color} opacity="0.6" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

Object.assign(window, {
  STAGE, VARIANT_ALIAS,
  TIER_COLORS, TIER_NAMES,
  LevelMarker, StreakCounter, Flame, XPBar, TierDot, XPValue,
  AnimePortrait, AvatarFrame,
  TabNav, ChevronRight, Sparkle, PaperCrane, Leaf, Moon,
  SoftCard, DustMotes,
});
