interface IconProps {
  size?: number
  color?: string
}

export function ChevronRight({ size = 14, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M5 3 L 9 7 L 5 11"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronLeft({ size = 14, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M9 3 L 5 7 L 9 11"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Lightbulb({ size = 14, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2 C 5.5 2, 4 4, 4 6.2 C 4 7.5, 4.6 8.6, 5.6 9.4 L 5.6 11 L 10.4 11 L 10.4 9.4 C 11.4 8.6, 12 7.5, 12 6.2 C 12 4, 10.5 2, 8 2 Z"
        stroke={color}
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M6 12.5 L 10 12.5 M 6.5 14 L 9.5 14"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}
