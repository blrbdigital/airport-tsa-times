import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import type { CheckpointWait } from '../lib/types';

interface CheckpointListProps {
  checkpoints: CheckpointWait[];
}

export default function CheckpointList({ checkpoints }: CheckpointListProps) {
  // Sort: general lines first, then precheck
  const sorted = [...checkpoints].sort((a, b) => {
    if (a.isPrecheck !== b.isPrecheck) return a.isPrecheck ? 1 : -1;
    return a.avgWait - b.avgWait;
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Checkpoints</h3>
        <span className="text-[10px] text-slate-600 board-text">AVG WAIT</span>
      </div>

      <div className="space-y-1.5">
        {sorted.map((cp, i) => {
          const level = getWaitLevel(cp.avgWait);
          const color = getWaitColor(level);

          const trendIcon = {
            up: '↑',
            down: '↓',
            stable: '→',
          }[cp.trend];

          const trendColor = {
            up: 'text-wait-red',
            down: 'text-wait-green',
            stable: 'text-slate-500',
          }[cp.trend];

          return (
            <div
              key={cp.id}
              className="flex items-center gap-3 py-3 px-4 rounded-lg bg-terminal-card border border-terminal-border animate-slide-up"
              style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
            >
              {/* Checkpoint info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-200">{cp.name}</span>
                  {cp.isPrecheck && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 board-text">
                      PRE✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px] text-slate-500">
                    {cp.reportCount} report{cp.reportCount !== 1 ? 's' : ''}
                  </span>
                  {cp.lastReport && (
                    <span className="text-[11px] text-slate-600">
                      {formatTimeAgo(cp.lastReport)}
                    </span>
                  )}
                </div>
              </div>

              {/* Trend arrow */}
              <span className={`text-sm ${trendColor} board-text`}>
                {trendIcon}
              </span>

              {/* Wait time */}
              <div className="text-right flex-shrink-0">
                <span className={`board-text text-xl font-bold ${color}`}>
                  {cp.avgWait}
                </span>
                <span className={`${color} opacity-60 text-xs board-text ml-0.5`}>min</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
