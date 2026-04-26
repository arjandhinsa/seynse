import type { InputHTMLAttributes } from 'react'

interface SoftInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function SoftInput({ label, id, style, ...rest }: SoftInputProps) {
  const inputId =
    id ?? `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label htmlFor={inputId} className="label">
        {label}
      </label>
      <input
        id={inputId}
        {...rest}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-md)',
          color: 'var(--ink)',
          fontFamily: 'var(--body)',
          fontSize: 15,
          outline: 'none',
          transition: 'border-color 0.18s ease',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--line-strong)'
          rest.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--line)'
          rest.onBlur?.(e)
        }}
      />
    </div>
  )
}
