import ProgressBar from '@/components/ui/ProgressBar'

interface MomentumBarProps {
  overallPct: number
  remainingMilestones: number
  activeBlockers: number
  compact?: boolean
}

export default function MomentumBar({ overallPct, remainingMilestones, activeBlockers, compact }: MomentumBarProps) {
  const pct = Math.round(overallPct)
  const barColor = pct >= 75 ? 'teal' : pct >= 35 ? 'yellow' : 'red'
  const pctColor = barColor === 'teal' ? 'text-cyan-400' : barColor === 'yellow' ? 'text-amber-400' : 'text-red-400'
  const blockerColor = activeBlockers > 0 ? 'text-red-400' : 'text-emerald-400'

  if (compact) {
    return (
      <div className="flex items-center gap-5 text-right">
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Revenue</p>
          <p className={`text-lg font-semibold tabular-nums leading-tight ${pctColor}`}>{pct}%</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Remaining</p>
          <p className="text-lg font-semibold tabular-nums leading-tight text-white">{remainingMilestones}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Blockers</p>
          <p className={`text-lg font-semibold tabular-nums leading-tight ${blockerColor}`}>{activeBlockers}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-neutral-700 bg-[#111] p-5">
      <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-5">Momentum</h2>
      <div className="grid grid-cols-3 gap-0 divide-x divide-neutral-800">
        <div className="pr-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs text-slate-500">To first revenue</p>
            <span className={`text-2xl font-semibold tabular-nums leading-none ${pctColor}`}>{pct}%</span>
          </div>
          <ProgressBar value={overallPct} color={barColor} height="sm" />
        </div>
        <div className="px-5">
          <p className="text-xs text-slate-500 mb-1.5">Milestones remaining</p>
          <p className="text-2xl font-semibold text-white tabular-nums leading-none">{remainingMilestones}</p>
          <p className="text-xs text-slate-600 mt-1">to open shop</p>
        </div>
        <div className="pl-5">
          <p className="text-xs text-slate-500 mb-1.5">Active blockers</p>
          <p className={`text-2xl font-semibold tabular-nums leading-none ${blockerColor}`}>{activeBlockers}</p>
          <p className="text-xs text-slate-600 mt-1">
            {activeBlockers === 0 ? 'clear' : activeBlockers === 1 ? 'open issue' : 'open issues'}
          </p>
        </div>
      </div>
    </div>
  )
}
