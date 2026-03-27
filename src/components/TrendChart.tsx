import { getWaitLevel } from '../lib/types';
import type { HourlyData } from '../lib/types';

interface TrendChartProps {
  data: HourlyData[];
  className?: string;
}

export default function TrendChart({ data, className = '' }: TrendChartProps) {
  const maxWait = Math.max(...data.map(d => d.avgWait), 1);
  const currentHour = new Date().getHours();

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-300">Today's Trend</h3>
        <div className="flex items-center gap-3 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-wait-green" /> &lt;15m
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-wait-yellow" /> 15-30m
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-wait-red" /> &gt;30m
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-[3px] h-32 px-1">
        {data.map((d) => {
          const height = (d.avgWait / maxWait) * 100;
          const level = getWaitLevel(d.avgWait);
          const isCurrent = d.hour === currentHour;

          const barColor = {
            low: 'bg-wait-green',
            medium: 'bg-wait-yellow',
            high: 'bg-wait-red',
          }[level];

          return (
            <div
              key={d.hour}
              className="flex-1 flex flex-col items-center gap-1 group relative"
            >
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                <div className="bg-slate-800 border border-terminal-border rounded px-2 py-1 text-[10px] board-text whitespace-nowrap shadow-lg">
                  <span className="text-slate-400">{d.hour > 12 ? d.hour - 12 : d.hour}{d.hour >= 12 ? 'pm' : 'am'}</span>
                  <span className="text-slate-200 ml-1.5">{d.avgWait}min</span>
                  <span className="text-slate-500 ml-1.5">({d.reportCount})</span>
                </div>
              </div>

              {/* Bar */}
              <div
                className={`w-full rounded-t-sm chart-bar ${barColor} ${
                  isCurrent ? 'opacity-100 ring-1 ring-amber/40' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ height: `${Math.max(height, 3)}%` }}
              />

              {/* Hour label (show every other + current) */}
              {(d.hour % 3 === 0 || isCurrent) && (
                <span className={`text-[9px] ${isCurrent ? 'text-amber font-medium' : 'text-slate-600'}`}>
                  {d.hour > 12 ? d.hour - 12 : d.hour}{d.hour >= 12 ? 'p' : 'a'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
