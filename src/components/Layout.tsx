import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-terminal-border bg-terminal-bg/90 glass-bg">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-amber/10 border border-amber/20 flex items-center justify-center group-hover:bg-amber/20 transition-colors">
              <span className="board-text text-amber text-xs font-bold">TSA</span>
            </div>
            <div className="flex flex-col">
              <span className="board-text text-sm font-bold text-slate-100 leading-none">
                AirportTSATimes
              </span>
              <span className="text-[10px] text-slate-500 leading-none mt-0.5">
                crowdsourced wait times
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                isHome
                  ? 'bg-terminal-card text-slate-100'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-terminal-card/50'
              }`}
            >
              Airports
            </Link>
            <Link
              to="/report"
              className="px-3 py-1.5 rounded-lg text-sm bg-amber/10 text-amber hover:bg-amber/20 transition-colors board-text font-medium"
            >
              + Report
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-terminal-border mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Real-time TSA wait times reported by travelers like you.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-wait-green live-pulse" />
              Live data
            </span>
            <span className="text-xs text-slate-600">
              {new Date().getFullYear()} AirportTSATimes
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
