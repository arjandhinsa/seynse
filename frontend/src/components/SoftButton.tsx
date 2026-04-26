import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface SoftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean
  children: ReactNode
}

export function SoftButton({
  primary,
  children,
  style,
  className,
  disabled,
  ...rest
}: SoftButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={['tap', className].filter(Boolean).join(' ')}
      style={{
        padding: '15px 18px',
        width: '100%',
        borderRadius: 'var(--r-pill)',
        background: primary
          ? 'linear-gradient(180deg, oklch(from var(--gold) calc(l - 0.18) c h) 0%, oklch(from var(--gold) calc(l - 0.32) c h) 100%)'
          : 'transparent',
        border: primary
          ? '1px solid oklch(from var(--gold) l c h / 0.55)'
          : '1px solid oklch(from var(--ink) l c h / 0.20)',
        color: primary ? 'var(--ink)' : 'var(--ink-2)',
        fontFamily: 'var(--display)',
        fontStyle: primary ? 'normal' : 'italic',
        fontSize: 15,
        fontWeight: 400,
        letterSpacing: '0.01em',
        boxShadow: primary ? '0 0 28px oklch(from var(--gold) l c h / 0.25)' : 'none',
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  )
}
