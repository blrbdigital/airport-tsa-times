import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isReport = location.pathname === '/report';

  return (
    <div className="min-h-screen bg-cream pb-20 sm:pb-0">
      {/* Top nav — minimal on mobile */}
      <header className="sticky top-0 z-50 bg-cream/80 glass border-b border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="mono text-[13px] font-bold tracking-tight text-ink">
              airport<span className="text-coral">tsa</span>times
            </span>
          </Link>

          {/* Desktop nav only */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/"
              className={`text-[13px] font-medium transition-colors ${
                isHome ? 'text-ink' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Airports
            </Link>
            <Link
              to="/report"
              className="text-[13px] font-semibold text-white bg-coral hover:bg-coral-dark px-3.5 py-1.5 rounded-full transition-colors"
            >
              Report Wait
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 glass sm:hidden safe-bottom" style={{ boxShadow: '0 -4px 24px rgba(26, 23, 21, 0.06), 0 -1px 3px rgba(26, 23, 21, 0.04)' }}>
        <div className="flex items-center justify-around px-6 pt-2 pb-3">
          <Link
            to="/"
            className="flex flex-col items-center gap-0.5 relative"
          >
            {/* Active indicator line */}
            {isHome && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-coral" />
            )}
            <span className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${
              isHome ? 'bg-coral-light' : ''
            }`}>
              <svg className={`w-[22px] h-[22px] transition-colors ${isHome ? 'text-coral' : 'text-ink-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isHome ? 2.5 : 1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </span>
            <span className={`text-[10px] font-semibold transition-colors ${isHome ? 'text-coral' : 'text-ink-muted'}`}>Airports</span>
          </Link>

          <Link
            to="/report"
            className="flex flex-col items-center gap-0.5 relative"
          >
            {/* Active indicator line */}
            {isReport && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-coral" />
            )}
            <span className={`flex items-center justify-center w-12 h-8 rounded-full transition-colors ${
              isReport ? 'bg-coral-light' : ''
            }`}>
              <svg className={`w-[22px] h-[22px] transition-colors ${isReport ? 'text-coral' : 'text-ink-muted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isReport ? 2.5 : 1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className={`text-[10px] font-semibold transition-colors ${isReport ? 'text-coral' : 'text-ink-muted'}`}>Report</span>
          </Link>
        </div>
      </nav>

      {/* Desktop footer only */}
      <footer className="hidden sm:block border-t border-border-light bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-ink-muted">
            Crowdsourced TSA data from real travelers.
          </p>
          <span className="flex items-center gap-1.5 text-xs text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-wait-green live-dot" />
            Live
          </span>
        </div>
      </footer>
    </div>
  );
}
