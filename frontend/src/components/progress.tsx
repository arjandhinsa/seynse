// Shared progress-display primitives. Ported from .design-base/primitives.jsx
// and pared down to the pieces we use on Home + (later) Challenges.

const TIER_COLORS: Record<number, string> = {
  1: 'var(--t1)',
  2: 'var(--t2)',
  3: 'var(--t3)',
  4: 'var(--t4)',
  5: 'var(--t5)',
}

export function tierColor(tier: number): string {
  return TIER_COLORS[tier] ?? TIER_COLORS[1]
}

// L1 → "Hidden", L2 → "Seeker", L3 → "Apprentice", L4 → "Adept",
// L5 → "Open", L6+ → "Sage"
const STAGES = ['Hidden', 'Seeker', 'Apprentice', 'Adept', 'Open', 'Sage']
export function stageLabelForLevel(level: number): string {
  if (level <= 1) return STAGES[0]
  if (level >= 6) return STAGES[5]
  return STAGES[level - 1]
}

// ──────────────────────────────────────────────────────────────
// Flame — single thin stroke, dusty rose
// ──────────────────────────────────────────────────────────────
export function Flame({ size = 16, color = 'var(--rose)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2.5 C 10 5.5, 7 6, 7 9.5 C 7 12, 8.7 13.5, 10 13.5 C 11.3 13.5, 13 12.2, 13 10.5 C 13 9, 12 8.5, 12 7.2 C 13.4 7.8, 15 9.4, 15 12 C 15 15, 12.8 17.2, 10 17.2 C 7.2 17.2, 5 15, 5 12 C 5 8, 8.5 6.5, 10 2.5 Z"
        stroke={color}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ──────────────────────────────────────────────────────────────
// StreakCounter — pill, rose tint. Inactive variant when no streak.
// ──────────────────────────────────────────────────────────────
interface StreakCounterProps {
  days: number
  active: boolean
}
export function StreakCounter({ days, active }: StreakCounterProps) {
  if (!active || days === 0) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 12px 5px 9px',
          background: 'transparent',
          borderRadius: 'var(--r-pill)',
          border: '1px solid var(--line)',
        }}
      >
        <Flame size={15} color="var(--ink-3)" />
        <span className="label" style={{ fontSize: 9.5, color: 'var(--ink-3)' }}>
          start a streak
        </span>
      </div>
    )
  }
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 12px 5px 9px',
        background: 'oklch(from var(--rose) l c h / 0.10)',
        borderRadius: 'var(--r-pill)',
        border: '1px solid oklch(from var(--rose) l c h / 0.22)',
      }}
    >
      <Flame size={15} />
      <span
        className="display tnum"
        style={{ fontSize: 14, color: 'var(--rose-2)', lineHeight: 1 }}
      >
        {days}
      </span>
      <span className="label" style={{ fontSize: 9, color: 'var(--rose-2)', opacity: 0.75 }}>
        days
      </span>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// TierDot — small radial gem, optional label
// ──────────────────────────────────────────────────────────────
interface TierDotProps {
  tier: number
  size?: number
  withLabel?: boolean
}
export function TierDot({ tier, size = 12, withLabel = false }: TierDotProps) {
  const color = tierColor(tier)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, oklch(from ${color} calc(l + 0.05) c h) 0%, oklch(from ${color} calc(l - 0.10) c h) 100%)`,
          boxShadow: `0 0 0 3px oklch(from ${color} l c h / 0.10)`,
          flexShrink: 0,
        }}
      />
      {withLabel && (
        <span className="label" style={{ color: 'var(--ink-2)', fontSize: 9.5 }}>
          tier {tier}
        </span>
      )}
    </span>
  )
}

// ──────────────────────────────────────────────────────────────
// XPBar — bar only, no built-in labels (caller adds context lines)
// ──────────────────────────────────────────────────────────────
interface XPBarProps {
  current: number
  max: number
  height?: number
}
export function XPBar({ current, max, height = 8 }: XPBarProps) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.max(0, (current / max) * 100))
  return (
    <div
      style={{
        position: 'relative',
        height,
        background: 'oklch(from var(--bg-3) l c h / 0.7)',
        borderRadius: 'var(--r-pill)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: `${pct}%`,
          background:
            'linear-gradient(90deg, oklch(from var(--teal) calc(l - 0.05) calc(c + 0.02) h) 0%, var(--gold) 100%)',
          borderRadius: 'var(--r-pill)',
          boxShadow: '0 0 12px oklch(from var(--gold) l c h / 0.30)',
        }}
      />
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// ArcProgress — small ring with accent stroke
// ──────────────────────────────────────────────────────────────
interface ArcProgressProps {
  pct: number
  accent: string
  size?: number
}
export function ArcProgress({ pct, accent, size = 52 }: ArcProgressProps) {
  const r = size * 0.42
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const dashoffset = circ * (1 - Math.min(1, Math.max(0, pct / 100)))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="oklch(from var(--bg-3) l c h / 0.7)"
        strokeWidth="2"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeDasharray={circ}
        strokeDashoffset={dashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{
          filter: `drop-shadow(0 0 4px oklch(from ${accent} l c h / 0.4))`,
          transition: 'stroke-dashoffset 0.6s ease-out',
        }}
      />
      <circle cx={cx} cy={cy} r="3" fill={accent} opacity="0.85" />
    </svg>
  )
}

// ──────────────────────────────────────────────────────────────
// LevelDisc — gold-accented orb with the number, no label
// ──────────────────────────────────────────────────────────────
interface LevelDiscProps {
  level: number
  size?: number
}
export function LevelDisc({ level, size = 44 }: LevelDiscProps) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 30%, oklch(from var(--gold) calc(l + 0.04) c h / 0.55) 0%, oklch(from var(--gold) calc(l - 0.18) c h / 0.85) 70%)',
          boxShadow:
            'inset 0 0 0 1px oklch(from var(--gold) l c h / 0.6), 0 0 24px oklch(from var(--gold) l c h / 0.20)',
        }}
      />
      <div
        className="breathe"
        style={{
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, oklch(from var(--gold) l c h / 0.28) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink)',
        }}
      >
        <span
          className="display tnum"
          style={{
            fontSize: size * 0.5,
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          {level}
        </span>
      </div>
    </div>
  )
}
