import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-cream/80 glass border-b border-border-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="mono text-[13px] font-bold tracking-tight text-ink">
              airport<span className="text-coral">tsa</span>times
            </span>
          </Link>

          <div className="flex items-center gap-4">
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-border-light bg-cream">
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
