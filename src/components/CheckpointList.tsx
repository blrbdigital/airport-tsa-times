import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import type { CheckpointWait } from '../lib/types';

interface CheckpointListProps {
  checkpoints: CheckpointWait[];
}

export default function CheckpointList({ checkpoints }: CheckpointListProps) {
  const sorted = [...checkpoints].sort((a, b) => {
    if (a.isPrecheck !== b.isPrecheck) return a.isPrecheck ? 1 : -1;
    return a.avgWait - b.avgWait;
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-ink">Checkpoints</h3>
        <span className="text-[10px] text-ink-faint mono uppercase tracking-wider">Avg Wait</span>
      </div>

      <div className="space-y-2">
        {sorted.map((cp, i) => {
          const level = getWaitLevel(cp.avgWait);
          const color = getWaitColor(level);

          const trendIcon = { up: '\u2191', down: '\u2193', stable: '\u2192' }[cp.trend];
          const trendColor = { up: 'text-wait-red', down: 'text-wait-green', stable: 'text-ink-faint' }[cp.trend];

          return (
            <div
              key={cp.id}
              className="flex items-center gap-3 py-3.5 sm:py-3.5 px-4 rounded-xl bg-surface border border-border-light shadow-sm animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">{cp.name}</span>
                  {cp.isPrecheck && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-sky-light text-sky mono font-medium">
                      PRE{'\u2713'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[11px] text-ink-muted">
                    {cp.reportCount} report{cp.reportCount !== 1 ? 's' : ''}
                  </span>
                  {cp.lastReport && (
                    <span className="text-[11px] text-ink-faint">
                      {formatTimeAgo(cp.lastReport)}
                    </span>
                  )}
                </div>
              </div>

              <span className={`text-sm ${trendColor} mono`}>{trendIcon}</span>

              <div className="text-right flex-shrink-0">
                <span className={`mono text-xl font-bold ${color}`}>{cp.avgWait}</span>
                <span className={`${color} opacity-60 text-xs mono ml-0.5`}>min</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
