import { useState } from 'react';
import { getWaitLevel, getWaitColor, formatTimeAgo } from '../lib/types';
import type { WaitReport } from '../lib/types';

interface LiveFeedProps {
  reports: WaitReport[];
  maxItems?: number;
  /** When true, twitter-sourced reports show tweet text expanded by default */
  expandTweets?: boolean;
}

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function LiveFeed({ reports, maxItems = 8, expandTweets = false }: LiveFeedProps) {
  const displayed = reports.slice(0, maxItems);
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-wait-green live-dot" />
        <h3 className="text-sm font-semibold text-ink">Live Reports</h3>
        <span className="text-[10px] text-ink-faint ml-auto mono">
          {displayed.length} report{displayed.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {displayed.map((report, i) => {
          const level = getWaitLevel(report.waitMinutes);
          const color = getWaitColor(level);
          const isTwitter = report.sourceType === 'twitter';
          const isExpanded = expandTweets || expanded === report.id;

          return (
            <div
              key={report.id}
              className={`rounded-xl bg-surface border animate-slide-up overflow-hidden ${
                isTwitter
                  ? 'border-l-[3px] border-l-ink/10 border-border-light/60'
                  : 'border-border-light/60'
              }`}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              {/* Main row */}
              <div
                className={`flex items-center gap-3 py-3 px-3.5 ${
                  isTwitter && !expandTweets ? 'cursor-pointer active:bg-surface-hover' : ''
                }`}
                onClick={() => isTwitter && !expandTweets && setExpanded(isExpanded ? null : report.id)}
              >
                <span className="mono text-xs font-bold text-coral w-8 flex-shrink-0">
                  {report.airportCode}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-ink font-medium truncate block">
                    {report.checkpointName}
                  </span>
                  {/* Inline tweet preview snippet — always visible for twitter source */}
                  {isTwitter && report.sourceText && !isExpanded && (
                    <span className="text-[11px] text-ink-muted truncate block mt-0.5 italic leading-tight">
                      "{report.sourceText}"
                    </span>
                  )}
                </div>
                {isTwitter && (
                  <XIcon className="w-3 h-3 text-ink-faint/60 flex-shrink-0" />
                )}
                <span className={`mono text-sm font-bold ${color} flex-shrink-0`}>
                  {report.waitMinutes}m
                </span>
                <span className="text-[10px] text-ink-faint flex-shrink-0 w-10 text-right">
                  {formatTimeAgo(report.reportedAt)}
                </span>
              </div>

              {/* Expanded tweet text */}
              {isTwitter && isExpanded && report.sourceText && (
                <div className="px-3.5 pb-3 pt-0 animate-fade-in">
                  <div className="bg-cream-dark/70 rounded-lg p-3 text-xs text-ink-light leading-relaxed border border-border-light/40">
                    <div className="flex items-start gap-2">
                      <XIcon className="w-3 h-3 text-ink-faint mt-0.5 flex-shrink-0" />
                      <p className="italic flex-1">"{report.sourceText}"</p>
                    </div>
                    {report.sourceUrl && (
                      <a
                        href={report.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-coral mt-2.5 font-medium active:text-coral-dark"
                        onClick={e => e.stopPropagation()}
                      >
                        View on X
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {displayed.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-ink-faint">No reports yet today.</p>
            <p className="text-xs text-ink-faint mt-1">Be the first to report!</p>
          </div>
        )}
      </div>
    </div>
  );
}
