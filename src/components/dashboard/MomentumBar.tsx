import ProgressBar from '@/components/ui/ProgressBar'

interface MomentumBarProps {
  overallPct: number
  remainingMilestones: number
  activeBlockers: number
}

export default function MomentumBar({ overallPct, remainingMilestones, activeBlockers }: MomentumBarProps) {
  const pct = Math.round(overallPct)
  const barColor = pct >= 75 ? 'green' : pct >= 35 ? 'yellow' : 'red'
  const pctColor = barColor === 'green' ? 'text-emerald-400' : barColor === 'yellow' ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="rounded-lg border border-neutral-700 bg-[#111] p-5">
      <h2 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-5">Momentum</h2>

      <div className="grid grid-cols-3 gap-0 divide-x divide-neutral-800">

        {/* % to first revenue */}
        <div className="pr-5">
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs text-neutral-500">To first revenue</p>
            <span className={`text-2xl font-semibold tabular-nums leading-none ${pctColor}`}>{pct}%</span>
          </div>
          <ProgressBar value={overallPct} color={barColor} height="sm" />
        </div>

        {/* Milestones remaining */}
        <div className="px-5">
          <p className="text-xs text-neutral-500 mb-1.5">Milestones remaining</p>
          <p className="text-2xl font-semibold text-white tabular-nums leading-none">{remainingMilestones}</p>
          <p className="text-xs text-neutral-600 mt-1">to open shop</p>
        </div>

        {/* Active blockers */}
        <div className="pl-5">
          <p className="text-xs text-neutral-500 mb-1.5">Active blockers</p>
          <p className={`text-2xl font-semibold tabular-nums leading-none ${activeBlockers > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {activeBlockers}
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            {activeBlockers === 0 ? 'clear' : activeBlockers === 1 ? 'open issue' : 'open issues'}
          </p>
        </div>

      </div>
    </div>
  )
}
