// portraits.jsx
// Two distinct character implementations sharing the same Ghibli-leaning
// scene system. The character on the LEFT/main column is a single gender
// (masculine OR feminine), and silhouettes diverge meaningfully:
//   • Masculine: square jaw, broader yoke, short layered hair just above
//     shoulders, heavier brow, thicker neck, flatter chest line.
//   • Feminine: rounded soft jaw, narrow shoulders, long layered hair past
//     shoulders w/ painterly clumps, fuller lips, longer lashes, hair clip,
//     softer chest dart in garment, slimmer neck.
//
// Shared: skin tone, teal hair streak, lotus motif progression, expression
// per stage, watercolor backdrop, paint filter. Same outfit family but cut
// differently for each silhouette.
//
// All originals; no copyrighted/branded references.

const STAGE_PALETTE = window.STAGE; // imported from primitives.jsx
const VARIANT_ALIAS_LOCAL = { voice: 'adept', luminary: 'open' };

// ─────────────────────────────────────────────────────────────────────
// Shared scene backdrop — identical between male/female so the character
// (not the world) is what changes
// ─────────────────────────────────────────────────────────────────────
function SceneBackdrop({ v, stage, cardId }) {
  return (
    <g filter={`url(#wash-fx-${cardId})`}>
      <rect x="0" y="0" width="100" height="120" fill={`url(#sky-${cardId})`} />
      <rect x="0" y="0" width="100" height="120" fill={`url(#light-${cardId})`} />

      {v === 'hidden' && (
        <>
          <ellipse cx="20" cy="78" rx="14" ry="22" fill="oklch(35% 0.012 250 / 0.55)" />
          <ellipse cx="80" cy="80" rx="16" ry="24" fill="oklch(30% 0.012 250 / 0.6)" />
          <circle cx="78" cy="62" r="1.6" fill="oklch(82% 0.060 80 / 0.5)" />
          <line x1="78" y1="63" x2="78" y2="76" stroke="oklch(25% 0.010 250 / 0.7)" strokeWidth="0.4" />
          <rect x="0" y="65" width="100" height="55" fill={stage.fogTint} />
          <ellipse cx="50" cy="98" rx="60" ry="14" fill="oklch(65% 0.012 250 / 0.30)" />
        </>
      )}
      {v === 'seeker' && (
        <>
          <rect x="3" y="22" width="40" height="60" rx="2" fill="oklch(80% 0.030 80 / 0.35)" />
          <rect x="3" y="22" width="40" height="60" rx="2" fill="none" stroke="oklch(50% 0.025 50 / 0.4)" strokeWidth="0.6" />
          <line x1="23" y1="22" x2="23" y2="82" stroke="oklch(50% 0.025 50 / 0.35)" strokeWidth="0.4" />
          <ellipse cx="20" cy="58" rx="10" ry="18" fill="oklch(70% 0.025 80 / 0.4)" />
          <rect x="0" y="98" width="100" height="22" fill="oklch(50% 0.040 50 / 0.7)" />
        </>
      )}
      {v === 'apprentice' && (
        <>
          <rect x="0" y="0" width="100" height="50" fill="oklch(56% 0.035 150 / 0.45)" />
          <ellipse cx="14" cy="20" rx="4" ry="6" fill="oklch(75% 0.040 320 / 0.5)" />
          <ellipse cx="84" cy="14" rx="3" ry="5" fill="oklch(75% 0.040 320 / 0.5)" />
          <ellipse cx="92" cy="36" rx="2.5" ry="4" fill="oklch(75% 0.040 320 / 0.45)" />
          <ellipse cx="8"  cy="42" rx="2.5" ry="4" fill="oklch(75% 0.040 320 / 0.4)" />
          <ellipse cx="70" cy="20" rx="40" ry="20" fill="oklch(90% 0.040 80 / 0.20)" />
        </>
      )}
      {v === 'adept' && (
        <>
          <ellipse cx="14" cy="74" rx="6" ry="14" fill="oklch(40% 0.040 50 / 0.45)" />
          <ellipse cx="86" cy="76" rx="7" ry="15" fill="oklch(38% 0.045 50 / 0.5)" />
          <ellipse cx="6"  cy="82" rx="4" ry="10" fill="oklch(42% 0.040 50 / 0.4)" />
          <ellipse cx="94" cy="84" rx="5" ry="11" fill="oklch(38% 0.040 50 / 0.45)" />
          <ellipse cx="80" cy="22" rx="22" ry="14" fill="oklch(90% 0.080 70 / 0.45)" />
          <ellipse cx="80" cy="22" rx="10" ry="6" fill="oklch(95% 0.060 80 / 0.55)" />
        </>
      )}
      {v === 'open' && (
        <>
          <ellipse cx="50" cy="105" rx="80" ry="18" fill="oklch(72% 0.030 100 / 0.7)" />
          {[12, 24, 78, 88].map((x, i) => (
            <path key={i} d={`M${x} 100 Q ${x+1} 94, ${x+0.5} 88`}
                  stroke="oklch(60% 0.040 130 / 0.6)" strokeWidth="0.5" fill="none" />
          ))}
          <ellipse cx="18" cy="32" rx="1.5" ry="2.2" fill="oklch(85% 0.040 20 / 0.7)" transform="rotate(20 18 32)" />
          <ellipse cx="82" cy="42" rx="1.4" ry="2"   fill="oklch(85% 0.040 20 / 0.6)" transform="rotate(-15 82 42)" />
          <ellipse cx="88" cy="68" rx="1.3" ry="1.9" fill="oklch(85% 0.040 20 / 0.55)" transform="rotate(30 88 68)" />
        </>
      )}
      {v === 'sage' && (
        <>
          <path d="M0 70 L 18 56 L 32 64 L 48 50 L 62 60 L 78 52 L 100 66 L 100 80 L 0 80 Z"
                fill="oklch(50% 0.030 50 / 0.5)" />
          <path d="M0 76 L 22 66 L 40 72 L 58 64 L 74 70 L 100 62 L 100 84 L 0 84 Z"
                fill="oklch(45% 0.030 30 / 0.6)" />
          <rect x="0" y="92" width="100" height="3" fill="oklch(38% 0.040 30 / 0.85)" />
          <rect x="0" y="106" width="100" height="14" fill="oklch(34% 0.040 30 / 0.95)" />
          <ellipse cx="78" cy="48" rx="22" ry="10" fill="oklch(90% 0.080 50 / 0.45)" />
          <ellipse cx="14" cy="28" rx="1.4" ry="2" fill="oklch(80% 0.060 20 / 0.6)" transform="rotate(20 14 28)" />
          <ellipse cx="88" cy="36" rx="1.3" ry="1.9" fill="oklch(82% 0.060 20 / 0.55)" transform="rotate(-20 88 36)" />
          <ellipse cx="22" cy="58" rx="1.2" ry="1.7" fill="oklch(80% 0.060 20 / 0.5)" transform="rotate(35 22 58)" />
        </>
      )}
      <rect x="0" y="0" width="100" height="120" fill={`url(#wash-${cardId})`} />
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Defs — gradients + watercolor filter, shared
// ─────────────────────────────────────────────────────────────────────
function PortraitDefs({ stage, cardId, hairLight, hair, tier, isF }) {
  return (
    <defs>
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
      <radialGradient id={`wash-${cardId}`} cx="30%" cy="40%" r="80%">
        <stop offset="0%" stopColor="oklch(95% 0.020 80 / 0.10)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <linearGradient id={`lip-${cardId}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(60% 0.10 25)" />
        <stop offset="100%" stopColor="oklch(45% 0.08 20)" />
      </linearGradient>
      <filter id={`paint-${cardId}`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={tier * 7 + (isF ? 3 : 1)} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" xChannelSelector="R" yChannelSelector="G" result="dist" />
        <feGaussianBlur in="dist" stdDeviation="0.18" />
      </filter>
      <filter id={`wash-fx-${cardId}`} x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed={tier * 11} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="0.5" />
      </filter>
    </defs>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Lotus motif — same in both portraits, drawn into a given location
// ─────────────────────────────────────────────────────────────────────
function LotusMotif({ kind, cx = 63, cy = 53 }) {
  if (!kind) return null;
  if (kind === 'tattoo') {
    return <path d={`M${cx-1} ${cy} L ${cx-0.5} ${cy-2} L ${cx+0.5} ${cy-1.5} L ${cx} ${cy} L ${cx+1} ${cy-0.5} L ${cx+0.8} ${cy+0.6} L ${cx-0.2} ${cy+0.4} Z`}
           fill="oklch(40% 0.040 320 / 0.55)" />;
  }
  if (kind === 'tattoo-bloom') {
    return (
      <>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="0.6" ry="1.6"
                   fill="oklch(45% 0.045 320 / 0.65)"
                   transform={`rotate(${deg} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r="0.5" fill="oklch(75% 0.060 60 / 0.7)" />
      </>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────
// Eye block — accepts expression knobs; lashes vary by sex parameter
// ─────────────────────────────────────────────────────────────────────
function Eyes({ stage, hair, isF, locked, hidden }) {
  if (locked || hidden) return null;
  const eyeOpenY = stage.expression === 'eyes-half' ? 1.7 : 2.5;
  const browTilt = stage.expression === 'down' ? 0.3
                  : stage.expression === 'open' ? -0.3 : 0;
  const lookY = stage.expression === 'down' ? 0.6 : 0;
  // feminine: slightly larger iris, longer lashes, thinner brows
  const irisR = isF ? 2.1 : 2.0;
  const lashW = isF ? 1.15 : 0.85;
  const browW = isF ? 0.7 : 1.0;
  return (
    <>
      <path d={`M40.5 ${50.5+lookY} Q 44.5 ${48.6+lookY-0.5}, 48.5 ${50.5+lookY} Q 44.5 ${52.8+lookY}, 40.5 ${50.5+lookY} Z`} fill="white" opacity="0.94" />
      <path d={`M51.5 ${50.5+lookY} Q 55.5 ${48.6+lookY-0.5}, 59.5 ${50.5+lookY} Q 55.5 ${52.8+lookY}, 51.5 ${50.5+lookY} Z`} fill="white" opacity="0.94" />
      <ellipse cx="44.5" cy={50.8+lookY} rx={irisR} ry={eyeOpenY} fill="oklch(35% 0.040 60)" />
      <ellipse cx="55.5" cy={50.8+lookY} rx={irisR} ry={eyeOpenY} fill="oklch(35% 0.040 60)" />
      <ellipse cx="44.5" cy={51+lookY} rx={irisR-0.4} ry={Math.max(eyeOpenY-0.4, 1.2)}
               fill={`oklch(from ${stage.accent} calc(l - 0.20) c h)`} opacity="0.55" />
      <ellipse cx="55.5" cy={51+lookY} rx={irisR-0.4} ry={Math.max(eyeOpenY-0.4, 1.2)}
               fill={`oklch(from ${stage.accent} calc(l - 0.20) c h)`} opacity="0.55" />
      <ellipse cx="44.5" cy={51.2+lookY} rx="1.0" ry={Math.min(eyeOpenY-0.3, 1.9)} fill="oklch(15% 0.015 250)" />
      <ellipse cx="55.5" cy={51.2+lookY} rx="1.0" ry={Math.min(eyeOpenY-0.3, 1.9)} fill="oklch(15% 0.015 250)" />
      <circle cx="45.3" cy={49.8+lookY} r="0.7" fill="white" />
      <circle cx="56.3" cy={49.8+lookY} r="0.7" fill="white" />
      <circle cx="44.0" cy={51.6+lookY} r="0.3" fill="white" opacity="0.7" />
      <circle cx="55.0" cy={51.6+lookY} r="0.3" fill="white" opacity="0.7" />
      {/* upper lash */}
      <path d={`M40.5 ${49.5+lookY} Q 44.5 ${47.8+lookY-0.4}, 48.5 ${49.5+lookY}`}
            stroke="oklch(20% 0.015 250)" strokeWidth={lashW} fill="none" strokeLinecap="round" />
      <path d={`M51.5 ${49.5+lookY} Q 55.5 ${47.8+lookY-0.4}, 59.5 ${49.5+lookY}`}
            stroke="oklch(20% 0.015 250)" strokeWidth={lashW} fill="none" strokeLinecap="round" />
      {isF && (
        <>
          <path d={`M47.8 ${49.4+lookY} Q 49 ${48.2+lookY}, 49.6 ${47.8+lookY}`} stroke="oklch(20% 0.015 250)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          <path d={`M52.2 ${49.4+lookY} Q 51 ${48.2+lookY}, 50.4 ${47.8+lookY}`} stroke="oklch(20% 0.015 250)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
          {/* tiny lower-lash dots */}
          <line x1="42.5" y1={52.3+lookY} x2="42.5" y2={52.9+lookY} stroke="oklch(20% 0.015 250 / 0.6)" strokeWidth="0.4" />
          <line x1="46.5" y1={52.4+lookY} x2="46.5" y2={53.0+lookY} stroke="oklch(20% 0.015 250 / 0.6)" strokeWidth="0.4" />
          <line x1="53.5" y1={52.4+lookY} x2="53.5" y2={53.0+lookY} stroke="oklch(20% 0.015 250 / 0.6)" strokeWidth="0.4" />
          <line x1="57.5" y1={52.3+lookY} x2="57.5" y2={52.9+lookY} stroke="oklch(20% 0.015 250 / 0.6)" strokeWidth="0.4" />
        </>
      )}
      {/* eyebrows */}
      <path d={`M40 ${44.6+browTilt} Q 44 ${43.6+browTilt-0.2}, 48.5 ${44.4+browTilt}`}
            stroke={hair} strokeWidth={browW} fill="none" strokeLinecap="round" opacity="0.9" />
      <path d={`M51.5 ${44.4+browTilt} Q 55.5 ${43.6+browTilt-0.2}, 60 ${44.6+browTilt}`}
            stroke={hair} strokeWidth={browW} fill="none" strokeLinecap="round" opacity="0.9" />
      {/* masculine: brow hair texture lines */}
      {!isF && (
        <>
          <line x1="42" y1={44.4+browTilt} x2="42.5" y2={43.7+browTilt} stroke={hair} strokeWidth="0.3" opacity="0.5" />
          <line x1="44" y1={44.0+browTilt} x2="44.4" y2={43.4+browTilt} stroke={hair} strokeWidth="0.3" opacity="0.5" />
          <line x1="56" y1={44.0+browTilt} x2="55.6" y2={43.4+browTilt} stroke={hair} strokeWidth="0.3" opacity="0.5" />
          <line x1="58" y1={44.4+browTilt} x2="57.5" y2={43.7+browTilt} stroke={hair} strokeWidth="0.3" opacity="0.5" />
        </>
      )}
      {stage.expression === 'eyes-half' && (
        <>
          <path d="M40.5 50 Q 44.5 50.6, 48.5 50" stroke={hair} strokeWidth="0.7" fill="none" />
          <path d="M51.5 50 Q 55.5 50.6, 59.5 50" stroke={hair} strokeWidth="0.7" fill="none" />
        </>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Mouth — varies by expression and sex
// ─────────────────────────────────────────────────────────────────────
function Mouth({ stage, isF, cardId }) {
  const lipBase = isF ? 0.95 : 0.7;
  const exp = stage.expression;
  let path;
  if (exp === 'half-smile') path = "M47.8 60 Q 50 61.2, 52.4 60.2";
  else if (exp === 'calm')  path = "M48 60.4 Q 50 61, 52 60.4";
  else if (exp === 'warm')  path = "M47.2 60 Q 50 61.6, 52.8 60";
  else if (exp === 'open')  path = "M47.6 60.2 Q 50 61.4, 52.4 60.2";
  else if (exp === 'eyes-half') path = "M47.6 60 Q 50 61.4, 52.4 60";
  else path = "M48.4 60.4 Q 50 60.6, 51.6 60.4"; // down
  return (
    <>
      <path d={path} stroke="oklch(45% 0.06 25)" strokeWidth={lipBase} fill="none" strokeLinecap="round" />
      {isF && exp !== 'down' && (
        <>
          {/* upper lip subtle volume */}
          <path d="M47.8 59.5 Q 49 59.0, 50 59.4 Q 51 59.0, 52.2 59.5" stroke={`url(#lip-${cardId})`} strokeWidth="0.45" fill="none" opacity="0.7" />
          {/* lower lip gentle gradient fill */}
          <ellipse cx="50" cy="60.7" rx="1.7" ry="0.45" fill={`url(#lip-${cardId})`} opacity="0.55" />
          {/* cupid's bow nick */}
          <path d="M49.6 59.6 Q 50 59.85, 50.4 59.6" stroke="oklch(45% 0.06 25 / 0.5)" strokeWidth="0.3" fill="none" />
        </>
      )}
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════
// MASCULINE PORTRAIT
// Square jaw, broad shoulders, short layered hair just above shoulders,
// thicker neck, flatter chest, heavier brow.
// ═════════════════════════════════════════════════════════════════════
function MasculinePortrait({ tier = 1, locked = false, size = 120, variant = 'apprentice', elder = false }) {
  const v = VARIANT_ALIAS_LOCAL[variant] || variant;
  const stage = STAGE_PALETTE[v] || STAGE_PALETTE.apprentice;
  const skin = 'oklch(82% 0.045 60)';
  const skinShade = 'oklch(70% 0.050 50)';
  const hair = elder ? 'oklch(70% 0.008 260)' : 'oklch(24% 0.018 260)';
  const hairLight = elder ? 'oklch(86% 0.005 260)' : 'oklch(34% 0.020 260)';
  const tealStreak = stage.accent;
  const cardId = `m-${v}-${tier}-${Math.floor(size)}`;
  const isF = false;
  const hidden = v === 'hidden';

  return (
    <svg width={size} height={size * 1.20} viewBox="0 0 100 120"
         style={{ filter: locked ? 'grayscale(0.7) brightness(0.55) saturate(0.6)' : 'none', display: 'block' }}>
      <PortraitDefs stage={stage} cardId={cardId} hairLight={hairLight} hair={hair} tier={tier} isF={isF} />
      <SceneBackdrop v={v} stage={stage} cardId={cardId} />

      <g filter={`url(#paint-${cardId})`}>
        {/* ─── BODY: broad shoulders, square yoke ─── */}
        {hidden && (
          <>
            <path d="M10 120 Q 10 84, 28 74 Q 34 72, 38 70 L 62 70 Q 66 72, 72 74 Q 90 84, 90 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            {/* hood up */}
            <path d="M24 50 Q 24 28, 50 26 Q 76 28, 76 50 Q 76 60, 70 64 Q 60 56, 50 56 Q 40 56, 30 64 Q 24 60, 24 50 Z"
                  fill={`url(#outfit-${cardId})`} />
            <ellipse cx="50" cy="56" rx="14" ry="6" fill="oklch(20% 0.010 250 / 0.55)" />
            <path d="M28 92 Q 36 88, 38 96" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.7" />
            <path d="M72 92 Q 64 88, 62 96" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.7" />
            {/* drawstring */}
            <line x1="44" y1="60" x2="44" y2="74" stroke={stage.outfitShade} strokeWidth="0.4" />
            <line x1="56" y1="60" x2="56" y2="74" stroke={stage.outfitShade} strokeWidth="0.4" />
          </>
        )}
        {v === 'seeker' && (
          <>
            <path d="M12 120 Q 14 82, 30 74 L 38 70 L 62 70 L 70 74 Q 86 82, 88 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            <path d="M40 74 L 50 86 L 60 74 Z" fill={stage.inner} />
            <path d="M44 74 L 50 92 M 56 74 L 50 92" stroke={stage.outfitShade} strokeWidth="0.5" opacity="0.6" />
            {/* shoulder seams */}
            <path d="M30 76 L 36 74" stroke={stage.outfitShade} strokeWidth="0.4" opacity="0.6" />
            <path d="M70 76 L 64 74" stroke={stage.outfitShade} strokeWidth="0.4" opacity="0.6" />
            <ellipse cx="20" cy="106" rx="8" ry="2" fill="oklch(80% 0.020 80 / 0.85)" />
            <path d="M14 106 Q 14 100, 18 100 L 22 100 Q 26 100, 26 106 Z" fill="oklch(85% 0.020 80)" />
            <ellipse cx="20" cy="100" rx="4" ry="1" fill="oklch(40% 0.040 40 / 0.85)" />
          </>
        )}
        {v === 'apprentice' && (
          <>
            <path d="M12 120 Q 14 82, 30 74 L 38 70 L 62 70 L 70 74 Q 86 82, 88 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            {/* mandarin collar — squared */}
            <path d="M40 71 L 60 71 L 60 75 L 40 75 Z" fill={stage.collar} opacity="0.85" />
            <path d="M40 75 Q 50 79, 60 75" stroke={stage.collar} strokeWidth="0.5" fill="none" opacity="0.8" />
            {/* center placket */}
            <line x1="50" y1="75" x2="50" y2="120" stroke={stage.outfitShade} strokeWidth="0.4" opacity="0.55" />
            <circle cx="50" cy="86" r="0.7" fill={stage.collar} />
            <circle cx="50" cy="98" r="0.7" fill={stage.collar} />
            <circle cx="58" cy="78" r="1.6" fill="oklch(78% 0.080 60)" stroke="oklch(40% 0.030 40)" strokeWidth="0.3" />
            <path d="M58 76.6 L 58.5 78 L 58 79.4 L 57.5 78 Z" fill="oklch(95% 0.030 80 / 0.7)" />
          </>
        )}
        {v === 'adept' && (
          <>
            <path d="M12 120 Q 14 82, 30 74 L 38 70 L 62 70 L 70 74 Q 86 82, 88 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            {/* open collar v */}
            <path d="M42 72 L 50 90 L 58 72 Z" fill={stage.inner} />
            {/* lapel folds */}
            <path d="M42 72 L 48 80" stroke={stage.outfitShade} strokeWidth="0.5" opacity="0.6" />
            <path d="M58 72 L 52 80" stroke={stage.outfitShade} strokeWidth="0.5" opacity="0.6" />
            {/* journal under arm */}
            <rect x="68" y="92" width="14" height="18" rx="0.5" fill="oklch(40% 0.045 50)" />
            <rect x="68" y="92" width="14" height="18" rx="0.5" fill="none" stroke="oklch(28% 0.040 50)" strokeWidth="0.4" />
            <line x1="68" y1="98" x2="82" y2="98" stroke="oklch(28% 0.040 50 / 0.6)" strokeWidth="0.3" />
            <circle cx="42" cy="78" r="1.4" fill="oklch(78% 0.080 60)" stroke="oklch(40% 0.030 40)" strokeWidth="0.3" />
            {/* sleeve roll */}
            <path d="M14 100 Q 16 96, 20 96" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.6" />
          </>
        )}
        {v === 'open' && (
          <>
            <path d="M8 120 Q 12 86, 26 76 Q 33 71, 38 68 L 62 68 Q 67 71, 74 76 Q 88 86, 92 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            <path d="M50 68 L 50 120" stroke={stage.accent2} strokeWidth="0.6" opacity="0.7" />
            <path d="M48 70 Q 50 73, 52 70" stroke={stage.accent2} strokeWidth="0.5" fill="none" />
            {/* obi sash */}
            <rect x="20" y="98" width="60" height="6" fill={stage.accent2} opacity="0.5" />
            <line x1="20" y1="98" x2="80" y2="98" stroke={stage.outfitShade} strokeWidth="0.4" opacity="0.7" />
            <path d="M14 96 Q 4 100, 6 110" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.6" />
            <path d="M86 96 Q 96 100, 94 110" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.6" />
            <ellipse cx="18" cy="100" rx="4" ry="4.2" fill={skin} />
            <ellipse cx="82" cy="100" rx="4" ry="4.2" fill={skin} />
            <path d="M16 98 L 16 102 M 18 97.5 L 18 102.5 M 20 98 L 20 102"
                  stroke={skinShade} strokeWidth="0.3" opacity="0.7" />
            <path d="M80 98 L 80 102 M 82 97.5 L 82 102.5 M 84 98 L 84 102"
                  stroke={skinShade} strokeWidth="0.3" opacity="0.7" />
          </>
        )}
        {v === 'sage' && (
          <>
            <path d="M6 120 Q 10 88, 26 78 L 38 72 L 62 72 L 74 78 Q 90 88, 94 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            <path d="M30 100 Q 50 96, 70 100" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.7" />
            <path d="M22 110 Q 50 106, 78 110" stroke={stage.outfitShade} strokeWidth="0.4" fill="none" opacity="0.6" />
            <ellipse cx="42" cy="92" rx="4.4" ry="3.2" fill={skin} />
            <ellipse cx="58" cy="92" rx="4.4" ry="3.2" fill={skin} />
            <path d="M44 88 Q 44 84, 48 84 L 52 84 Q 56 84, 56 88 L 56 92 Q 56 96, 50 96 Q 44 96, 44 92 Z"
                  fill="oklch(82% 0.025 60)" stroke="oklch(50% 0.040 40)" strokeWidth="0.4" />
            <ellipse cx="50" cy="86" rx="4" ry="0.7" fill="oklch(45% 0.060 40 / 0.8)" />
            <path d="M48 82 Q 49 79, 48 76 M 52 82 Q 53 79, 52 76"
                  stroke="oklch(85% 0.020 80 / 0.5)" strokeWidth="0.5" fill="none" />
            <rect x="76" y="106" width="16" height="6" rx="0.5" fill="oklch(38% 0.045 50)" />
          </>
        )}

        {/* THICK NECK — masculine */}
        {!hidden && (
          <>
            <path d="M43 64 L 43 72 Q 50 76.5, 57 72 L 57 64 Z" fill={skin} />
            <path d="M43 70 Q 50 73.5, 57 70" stroke={skinShade} strokeWidth="0.4" fill="none" opacity="0.6" />
            {/* adam's apple hint */}
            <path d="M49.5 71 Q 50 72.4, 50.5 71" stroke={skinShade} strokeWidth="0.3" fill="none" opacity="0.5" />
            {/* clavicle hint */}
            <path d="M40 72 Q 44 71, 48 72.5 M 52 72.5 Q 56 71, 60 72" stroke={skinShade} strokeWidth="0.35" fill="none" opacity="0.45" />
          </>
        )}

        {/* BACK HAIR — short, ABOVE shoulder, layered choppy */}
        {!hidden && (
          <path d="M30 38 Q 28 28, 34 22 Q 40 16, 46 17 Q 50 15, 54 17 Q 60 16, 66 22 Q 72 28, 70 38
                   Q 73 50, 71 60 L 70 64 L 67.5 60 L 65 64 L 62.5 58 L 60 62
                   L 60 54 Q 60 50, 58 46 L 42 46 Q 40 50, 40 54 L 40 62
                   L 37.5 58 L 35 64 L 32.5 60 L 30 64 L 29 60 Q 27 50, 30 38 Z"
                fill={`url(#hair-${cardId})`} />
        )}

        {/* FACE — square jaw, slightly wider */}
        {!hidden && (
          <>
            <path d="M37 50 Q 36 60, 40 65 Q 45 67, 50 67 Q 55 67, 60 65 Q 64 60, 63 50 Q 63 38, 50 36 Q 37 38, 37 50 Z"
                  fill={skin} />
            {/* cheek wash */}
            <ellipse cx="42" cy="56" rx="3" ry="1.3" fill="oklch(80% 0.05 30 / 0.5)" />
            <ellipse cx="58" cy="56" rx="3" ry="1.3" fill="oklch(80% 0.05 30 / 0.5)" />
            {/* jaw definition */}
            <path d="M37 55 Q 39 63, 46 66" stroke={skinShade} strokeWidth="0.45" fill="none" opacity="0.55" />
            <path d="M63 55 Q 61 63, 54 66" stroke={skinShade} strokeWidth="0.45" fill="none" opacity="0.55" />
            <path d="M46 66 Q 50 67.5, 54 66" stroke={skinShade} strokeWidth="0.4" fill="none" opacity="0.5" />
            {/* light stubble shadow at adept+sage */}
            {(v === 'adept' || v === 'sage') && (
              <ellipse cx="50" cy="63" rx="6.5" ry="1.4" fill="oklch(50% 0.020 50 / 0.18)" />
            )}
          </>
        )}
        {hidden && (
          <>
            <ellipse cx="50" cy="52" rx="11" ry="13" fill={skin} opacity="0.85" />
            <ellipse cx="50" cy="46" rx="13" ry="6" fill="oklch(15% 0.010 250 / 0.55)" />
            <ellipse cx="50" cy="58" rx="2" ry="1" fill="oklch(80% 0.05 30 / 0.4)" />
          </>
        )}

        {/* FRONT HAIR — short, choppy bangs with multiple peaks */}
        {!hidden && (
          <>
            <path d="M34 38 L 34 36 Q 34 34, 36 34
                     L 38 28 L 41 36
                     L 43 26 L 46 35
                     L 48 24 L 51 35
                     L 54 25 L 57 35
                     L 60 27 L 62 35
                     L 64 30 L 66 36
                     Q 66 34, 66 38 Z"
                  fill={`url(#hair-${cardId})`} />
            {/* teal streak */}
            <path d="M40 38 L 40 36 L 40.5 30 L 41.5 26 L 43 30 L 43 38 Z"
                  fill={tealStreak} opacity={v === 'sage' ? 0.42 : 0.92} />
            <path d="M41 36 L 41 30 L 41.7 28 L 42 32 L 42 36 Z"
                  fill={`oklch(from ${tealStreak} calc(l + 0.10) c h)`} opacity={v === 'sage' ? 0.3 : 0.7} />
            {/* sideburns — masculine longer */}
            <path d="M36 42 Q 36 52, 39 58" stroke={hair} strokeWidth="0.8" fill="none" opacity="0.85" />
            <path d="M64 42 Q 64 52, 61 58" stroke={hair} strokeWidth="0.8" fill="none" opacity="0.85" />
            {/* stray strand */}
            <path d="M52 26 Q 52 30, 51 34" stroke={hair} strokeWidth="0.5" fill="none" opacity="0.7" />
            <path d="M45 28 Q 44 32, 43.5 35" stroke={hair} strokeWidth="0.4" fill="none" opacity="0.6" />
          </>
        )}

        <Eyes stage={stage} hair={hair} isF={false} locked={locked} hidden={hidden} />

        {/* nose — slightly heavier line for masculine */}
        {!hidden && (
          <>
            <path d="M49 55 Q 49.4 57.4, 50.5 56.5" stroke={skinShade} strokeWidth="0.5" fill="none" strokeLinecap="round" />
            <path d="M50.5 56.5 Q 51.2 57.5, 50.6 57.6" stroke={skinShade} strokeWidth="0.3" fill="none" />
          </>
        )}

        <Mouth stage={stage} isF={false} cardId={cardId} />
        <LotusMotif kind={stage.showLotus} />

        <rect x="0" y="0" width="100" height="120" fill="oklch(80% 0.020 80 / 0.04)" />
      </g>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// FEMININE PORTRAIT
// Soft rounded jaw, narrow shoulders, long flowing hair past shoulders
// with clumped strands, fuller lips, longer lashes, hair clip/ornament,
// slim neck, soft chest dart in garment.
// ═════════════════════════════════════════════════════════════════════
function FemininePortrait({ tier = 1, locked = false, size = 120, variant = 'apprentice', elder = false }) {
  const v = VARIANT_ALIAS_LOCAL[variant] || variant;
  const stage = STAGE_PALETTE[v] || STAGE_PALETTE.apprentice;
  const skin = 'oklch(86% 0.038 55)';
  const skinShade = 'oklch(74% 0.045 45)';
  const hair = elder ? 'oklch(72% 0.008 270)' : 'oklch(26% 0.022 270)';
  const hairLight = elder ? 'oklch(88% 0.005 270)' : 'oklch(40% 0.025 270)';
  const tealStreak = stage.accent;
  const cardId = `f-${v}-${tier}-${Math.floor(size)}`;
  const isF = true;
  const hidden = v === 'hidden';

  // Stage-keyed hair ornament
  const ornament = {
    apprentice: { kind: 'flower', color: 'oklch(78% 0.080 320)' },
    adept:      { kind: 'pin',    color: 'oklch(78% 0.080 60)'  },
    open:       { kind: 'flower', color: 'oklch(85% 0.060 20)'  },
    sage:       { kind: 'pin',    color: 'oklch(60% 0.060 200)' },
  }[v];

  return (
    <svg width={size} height={size * 1.20} viewBox="0 0 100 120"
         style={{ filter: locked ? 'grayscale(0.7) brightness(0.55) saturate(0.6)' : 'none', display: 'block' }}>
      <PortraitDefs stage={stage} cardId={cardId} hairLight={hairLight} hair={hair} tier={tier} isF={isF} />
      <SceneBackdrop v={v} stage={stage} cardId={cardId} />

      <g filter={`url(#paint-${cardId})`}>

        {/* ─── LONG FLOWING HAIR — drawn FIRST so body sits over it ─── */}
        {!hidden && (
          <>
            {/* outer hair mass — falls past shoulders to ~y=110 */}
            <path d="M30 38 Q 26 30, 30 22 Q 36 14, 44 14 Q 47 12, 50 13 Q 53 12, 56 14 Q 64 14, 70 22 Q 74 30, 70 38
                     Q 76 56, 78 76 Q 79 92, 76 108 L 72 112
                     Q 70 100, 68 84 Q 66 74, 64 66
                     L 62 86 L 60 70 L 58 92 L 56 74 L 54 96 L 52 78
                     L 50 100 L 48 78 L 46 96 L 44 74 L 42 92 L 40 70 L 38 86
                     Q 36 74, 34 66 Q 32 74, 30 84 Q 28 100, 26 112 L 22 108
                     Q 21 92, 22 76 Q 24 56, 30 38 Z"
                  fill={`url(#hair-${cardId})`} />
            {/* inner painterly clumps — darker overlays for depth */}
            <path d="M30 78 Q 28 92, 26 108" stroke={hair} strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M70 78 Q 72 92, 74 108" stroke={hair} strokeWidth="0.6" fill="none" opacity="0.5" />
            <path d="M34 70 Q 33 86, 32 102" stroke={hair} strokeWidth="0.5" fill="none" opacity="0.45" />
            <path d="M66 70 Q 67 86, 68 102" stroke={hair} strokeWidth="0.5" fill="none" opacity="0.45" />
            {/* highlight strands */}
            <path d="M40 60 Q 39 78, 38 94" stroke={hairLight} strokeWidth="0.4" fill="none" opacity="0.7" />
            <path d="M60 60 Q 61 78, 62 94" stroke={hairLight} strokeWidth="0.4" fill="none" opacity="0.7" />
          </>
        )}

        {/* ─── BODY: narrow yoke, tapered waist suggestion ─── */}
        {hidden && (
          <>
            <path d="M18 120 Q 18 86, 32 76 Q 38 73, 40 70 L 60 70 Q 62 73, 68 76 Q 82 86, 82 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            <path d="M28 50 Q 28 28, 50 26 Q 72 28, 72 50 Q 72 60, 68 64 Q 60 56, 50 56 Q 40 56, 32 64 Q 28 60, 28 50 Z"
                  fill={`url(#outfit-${cardId})`} />
            <ellipse cx="50" cy="56" rx="13" ry="5.5" fill="oklch(20% 0.010 250 / 0.55)" />
            {/* loose hair strands escaping hood */}
            <path d="M34 60 Q 30 70, 28 80" stroke={hair} strokeWidth="0.5" fill="none" opacity="0.6" />
            <path d="M66 60 Q 70 70, 72 80" stroke={hair} strokeWidth="0.5" fill="none" opacity="0.6" />
            {/* drawstrings */}
            <line x1="46" y1="60" x2="46" y2="74" stroke={stage.outfitShade} strokeWidth="0.4" />
            <line x1="54" y1="60" x2="54" y2="74" stroke={stage.outfitShade} strokeWidth="0.4" />
            <circle cx="46" cy="74" r="0.6" fill={stage.outfitShade} />
            <circle cx="54" cy="74" r="0.6" fill={stage.outfitShade} />
          </>
        )}
        {v === 'seeker' && (
          <>
            <path d="M20 120 Q 22 84, 34 76 L 40 72 L 60 72 L 66 76 Q 78 84, 80 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            {/* scoop neckline */}
            <path d="M40 72 Q 50 80, 60 72" fill={stage.inner} />
            <path d="M40 72 Q 50 80, 60 72" stroke={stage.outfitShade} strokeWidth="0.4" fill="none" opacity="0.7" />
            {/* cardigan opening */}
            <path d="M44 76 L 46 96 M 56 76 L 54 96" stroke={stage.outfitShade} strokeWidth="0.45" opacity="0.6" />
            {/* small button */}
            <circle cx="50" cy="92" r="0.8" fill={stage.outfitShade} />
            {/* tea cup */}
            <ellipse cx="20" cy="106" rx="8" ry="2" fill="oklch(80% 0.020 80 / 0.85)" />
            <path d="M14 106 Q 14 100, 18 100 L 22 100 Q 26 100, 26 106 Z" fill="oklch(85% 0.020 80)" />
            <ellipse cx="20" cy="100" rx="4" ry="1" fill="oklch(40% 0.040 40 / 0.85)" />
          </>
        )}
        {v === 'apprentice' && (
          <>
            <path d="M20 120 Q 22 84, 34 76 L 40 72 L 60 72 L 66 76 Q 78 84, 80 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            {/* embroidered round neckline */}
            <path d="M42 73 Q 50 78, 58 73" stroke={stage.collar} strokeWidth="0.7" fill="none" />
            <path d="M44 76 Q 50 80, 56 76" stroke={stage.collar} strokeWidth="0.4" fill="none" opacity="0.7" />
            {/* darts hint at chest */}
            <path d="M44 84 Q 50 86, 50 90" stroke={stage.outfitShade} strokeWidth="0.3" fill="none" opacity="0.55" />
            <path d="M56 84 Q 50 86, 50 90" stroke={stage.outfitShade} strokeWidth="0.3" fill="none" opacity="0.55" />
            <circle cx="58" cy="78" r="1.6" fill="oklch(78% 0.080 60)" stroke="oklch(40% 0.030 40)" strokeWidth="0.3" />
            <path d="M58 76.6 L 58.5 78 L 58 79.4 L 57.5 78 Z" fill="oklch(95% 0.030 80 / 0.7)" />
          </>
        )}
        {v === 'adept' && (
          <>
            <path d="M20 120 Q 22 84, 34 76 L 40 72 L 60 72 L 66 76 Q 78 84, 80 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            {/* deeper v-neck with cream blouse beneath */}
            <path d="M42 72 L 50 92 L 58 72 Z" fill={stage.inner} />
            <path d="M42 72 L 50 92" stroke={stage.outfitShade} strokeWidth="0.45" opacity="0.6" />
            <path d="M58 72 L 50 92" stroke={stage.outfitShade} strokeWidth="0.45" opacity="0.6" />
            {/* delicate necklace */}
            <path d="M44 73 Q 50 76, 56 73" stroke="oklch(78% 0.080 60 / 0.9)" strokeWidth="0.4" fill="none" />
            <circle cx="50" cy="76" r="0.6" fill="oklch(78% 0.080 60)" />
            {/* journal under arm */}
            <rect x="68" y="92" width="14" height="18" rx="0.5" fill="oklch(40% 0.045 50)" />
            <line x1="68" y1="98" x2="82" y2="98" stroke="oklch(28% 0.040 50 / 0.6)" strokeWidth="0.3" />
            <circle cx="42" cy="78" r="1.4" fill="oklch(78% 0.080 60)" stroke="oklch(40% 0.030 40)" strokeWidth="0.3" />
          </>
        )}
        {v === 'open' && (
          <>
            <path d="M14 120 Q 18 88, 30 78 Q 36 73, 40 70 L 60 70 Q 64 73, 70 78 Q 82 88, 86 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            {/* wrap front */}
            <path d="M40 70 Q 50 86, 60 70" stroke={stage.accent2} strokeWidth="0.6" fill="none" opacity="0.8" />
            <path d="M40 70 L 50 88 L 60 70" stroke={stage.accent2} strokeWidth="0.5" fill="none" opacity="0.5" />
            {/* sash */}
            <rect x="22" y="96" width="56" height="5" fill={stage.accent2} opacity="0.5" />
            {/* sleeve drift */}
            <path d="M16 96 Q 8 102, 10 112" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.6" />
            <path d="M84 96 Q 92 102, 90 112" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.6" />
            {/* palms open */}
            <ellipse cx="20" cy="98" rx="3.4" ry="4" fill={skin} />
            <ellipse cx="80" cy="98" rx="3.4" ry="4" fill={skin} />
            <path d="M18 96 L 18 100 M 20 95.5 L 20 100.5 M 22 96 L 22 100"
                  stroke={skinShade} strokeWidth="0.3" opacity="0.7" />
            <path d="M78 96 L 78 100 M 80 95.5 L 80 100.5 M 82 96 L 82 100"
                  stroke={skinShade} strokeWidth="0.3" opacity="0.7" />
          </>
        )}
        {v === 'sage' && (
          <>
            <path d="M12 120 Q 14 90, 30 80 L 40 74 L 60 74 L 70 80 Q 86 90, 88 120 Z"
                  fill={`url(#outfit-${cardId})`} />
            <path d="M30 100 Q 50 96, 70 100" stroke={stage.outfitShade} strokeWidth="0.5" fill="none" opacity="0.7" />
            <path d="M22 110 Q 50 106, 78 110" stroke={stage.outfitShade} strokeWidth="0.4" fill="none" opacity="0.6" />
            <ellipse cx="42" cy="92" rx="3.8" ry="3" fill={skin} />
            <ellipse cx="58" cy="92" rx="3.8" ry="3" fill={skin} />
            <path d="M44 88 Q 44 84, 48 84 L 52 84 Q 56 84, 56 88 L 56 92 Q 56 96, 50 96 Q 44 96, 44 92 Z"
                  fill="oklch(82% 0.025 60)" stroke="oklch(50% 0.040 40)" strokeWidth="0.4" />
            <ellipse cx="50" cy="86" rx="4" ry="0.7" fill="oklch(45% 0.060 40 / 0.8)" />
            <path d="M48 82 Q 49 79, 48 76 M 52 82 Q 53 79, 52 76"
                  stroke="oklch(85% 0.020 80 / 0.5)" strokeWidth="0.5" fill="none" />
            <rect x="76" y="106" width="16" height="6" rx="0.5" fill="oklch(38% 0.045 50)" />
          </>
        )}

        {/* SLIM NECK — feminine */}
        {!hidden && (
          <>
            <path d="M45 64 L 45 72 Q 50 75.5, 55 72 L 55 64 Z" fill={skin} />
            <path d="M45 70 Q 50 72.5, 55 70" stroke={skinShade} strokeWidth="0.3" fill="none" opacity="0.5" />
            {/* delicate clavicle */}
            <path d="M42 72.5 Q 46 71.5, 50 72.8 M 50 72.8 Q 54 71.5, 58 72.5"
                  stroke={skinShade} strokeWidth="0.3" fill="none" opacity="0.4" />
          </>
        )}

        {/* FACE — soft rounded oval, narrower */}
        {!hidden && (
          <>
            <ellipse cx="50" cy="50" rx="13" ry="16.4" fill={skin} />
            {/* cheek wash */}
            <ellipse cx="42.5" cy="55" rx="2.8" ry="1.4" fill="oklch(82% 0.07 25 / 0.65)" />
            <ellipse cx="57.5" cy="55" rx="2.8" ry="1.4" fill="oklch(82% 0.07 25 / 0.65)" />
            {/* very soft jaw */}
            <path d="M38 55 Q 39.5 62, 44 64.5" stroke={skinShade} strokeWidth="0.25" fill="none" opacity="0.4" />
            <path d="M62 55 Q 60.5 62, 56 64.5" stroke={skinShade} strokeWidth="0.25" fill="none" opacity="0.4" />
            {/* chin dimple highlight */}
            <ellipse cx="50" cy="64" rx="0.6" ry="0.3" fill="oklch(95% 0.020 60 / 0.5)" />
          </>
        )}
        {hidden && (
          <>
            <ellipse cx="50" cy="52" rx="10.5" ry="13" fill={skin} opacity="0.85" />
            <ellipse cx="50" cy="46" rx="12" ry="6" fill="oklch(15% 0.010 250 / 0.55)" />
            <ellipse cx="50" cy="58" rx="2" ry="1" fill="oklch(82% 0.07 25 / 0.5)" />
          </>
        )}

        {/* FRONT HAIR — softer, side-parted bangs that frame face */}
        {!hidden && (
          <>
            {/* main fringe — side swept */}
            <path d="M34 38 Q 34 32, 38 30
                     Q 42 26, 48 28
                     Q 52 26, 56 27
                     Q 62 26, 66 30
                     Q 66 36, 66 40
                     Q 62 36, 58 36
                     Q 54 33, 50 35
                     Q 46 33, 42 36
                     Q 38 36, 34 40 Z"
                  fill={`url(#hair-${cardId})`} />
            {/* face-framing strands */}
            <path d="M36 38 Q 35 50, 34 62" stroke={hair} strokeWidth="0.7" fill="none" opacity="0.85" />
            <path d="M64 38 Q 65 50, 66 62" stroke={hair} strokeWidth="0.7" fill="none" opacity="0.85" />
            {/* teal streak */}
            <path d="M42 36 Q 41.5 40, 41 50 Q 41.5 60, 41 70"
                  stroke={tealStreak} strokeWidth="1.2" fill="none" strokeLinecap="round"
                  opacity={v === 'sage' ? 0.5 : 0.92} />
            <path d="M42 38 Q 41.7 50, 41.5 65"
                  stroke={`oklch(from ${tealStreak} calc(l + 0.10) c h)`} strokeWidth="0.6" fill="none" strokeLinecap="round"
                  opacity={v === 'sage' ? 0.4 : 0.7} />
            {/* loose front strand */}
            <path d="M48 32 Q 47 36, 46 40" stroke={hair} strokeWidth="0.45" fill="none" opacity="0.7" />
            <path d="M54 30 Q 55 35, 56 39" stroke={hair} strokeWidth="0.45" fill="none" opacity="0.7" />
            {/* HAIR ORNAMENT */}
            {ornament && ornament.kind === 'flower' && (
              <g>
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <ellipse key={i} cx="62" cy="32" rx="1.2" ry="2"
                           fill={ornament.color}
                           transform={`rotate(${deg} 62 32)`} />
                ))}
                <circle cx="62" cy="32" r="0.7" fill="oklch(95% 0.040 60)" />
              </g>
            )}
            {ornament && ornament.kind === 'pin' && (
              <g>
                <ellipse cx="62" cy="32" rx="2.4" ry="1" fill={ornament.color} stroke="oklch(40% 0.030 40)" strokeWidth="0.3" />
                <circle cx="62" cy="32" r="0.5" fill="oklch(95% 0.030 60 / 0.8)" />
              </g>
            )}
          </>
        )}

        <Eyes stage={stage} hair={hair} isF={true} locked={locked} hidden={hidden} />

        {/* nose — minimal Ghibli mark */}
        {!hidden && (
          <path d="M49.6 56 Q 50 57.2, 50.4 56" stroke={skinShade} strokeWidth="0.35" fill="none" strokeLinecap="round" />
        )}

        <Mouth stage={stage} isF={true} cardId={cardId} />
        <LotusMotif kind={stage.showLotus} />

        <rect x="0" y="0" width="100" height="120" fill="oklch(80% 0.020 80 / 0.04)" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Dispatcher — replaces the AnimePortrait export
// ─────────────────────────────────────────────────────────────────────
function AnimePortrait({ tier = 1, locked = false, size = 120, variant = 'apprentice', gender = 'male', elder = false }) {
  if (gender === 'female') {
    return <FemininePortrait tier={tier} locked={locked} size={size} variant={variant} elder={elder} />;
  }
  return <MasculinePortrait tier={tier} locked={locked} size={size} variant={variant} elder={elder} />;
}

Object.assign(window, {
  AnimePortrait, MasculinePortrait, FemininePortrait,
});
