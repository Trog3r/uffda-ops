interface ProgressBarProps {
  value: number // 0–100
  color?: 'teal' | 'green' | 'yellow' | 'red' | 'blue' | 'neutral'
  height?: 'xs' | 'sm'
  showLabel?: boolean
  animate?: boolean
}

const colorClass = {
  teal:    'bg-cyan-400',
  green:   'bg-emerald-500',
  yellow:  'bg-amber-500',
  red:     'bg-red-500',
  blue:    'bg-sky-500',
  neutral: 'bg-slate-600',
}

export default function ProgressBar({
  value,
  color = 'neutral',
  height = 'sm',
  showLabel = false,
  animate = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, Math.round(value)))
  const h = height === 'xs' ? 'h-0.5' : 'h-1'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${h} bg-neutral-800 rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full ${colorClass[color]} ${animate ? 'transition-[width] duration-700 ease-out' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-neutral-500 tabular-nums w-7 text-right shrink-0">
          {pct}%
        </span>
      )}
    </div>
  )
}
