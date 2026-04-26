import type { CSSProperties, ReactNode } from 'react'

interface SoftCardProps {
  children: ReactNode
  padding?: number
  radius?: string
  onClick?: () => void
  style?: CSSProperties
  className?: string
}

export function SoftCard({
  children,
  padding = 16,
  radius = 'var(--r-md)',
  onClick,
  style,
  className,
}: SoftCardProps) {
  const cls = [onClick ? 'tap' : '', className].filter(Boolean).join(' ')
  return (
    <div
      onClick={onClick}
      className={cls || undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: radius,
        padding,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
