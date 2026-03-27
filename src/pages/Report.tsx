import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { airports, searchAirports } from '../data/airports';
import { getWaitLevel, getWaitColor } from '../lib/types';
import type { Airport, Checkpoint } from '../lib/types';

type Step = 'airport' | 'checkpoint' | 'time' | 'success';

export default function Report() {
  const [searchParams] = useSearchParams();
  const preselectedCode = searchParams.get('airport');
  const preselectedAirport = preselectedCode
    ? airports.find(a => a.code.toLowerCase() === preselectedCode.toLowerCase())
    : undefined;

  const [step, setStep] = useState<Step>(preselectedAirport ? 'checkpoint' : 'airport');
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(preselectedAirport || null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [waitMinutes, setWaitMinutes] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAirports = useMemo(() => {
    return searchQuery ? searchAirports(searchQuery).slice(0, 12) : airports.slice(0, 20);
  }, [searchQuery]);

  const level = getWaitLevel(waitMinutes);
  const color = getWaitColor(level);

  const handleSubmit = () => {
    // In production: POST to Supabase
    console.log('Report submitted:', {
      airport: selectedAirport?.code,
      checkpoint: selectedCheckpoint?.id,
      waitMinutes,
    });
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-wait-green/20 border-2 border-wait-green flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-wait-green checkmark-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="board-text text-2xl font-bold text-slate-100 mb-2">Report Submitted</h2>
        <p className="text-sm text-slate-400 mb-1">
          <span className="board-text text-amber font-medium">{selectedAirport?.code}</span> — {selectedCheckpoint?.name}
        </p>
        <p className="text-sm text-slate-500 mb-8">
          You reported a <span className={`board-text font-medium ${color}`}>{waitMinutes} minute</span> wait.
        </p>
        <p className="text-xs text-slate-500 mb-6">Thanks for helping fellow travelers!</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to={`/airport/${selectedAirport?.code.toLowerCase()}`}
            className="px-4 py-2 rounded-lg bg-terminal-card border border-terminal-border text-sm text-slate-300 hover:bg-terminal-card-hover transition-colors"
          >
            View {selectedAirport?.code}
          </Link>
          <button
            onClick={() => {
              setStep('airport');
              setSelectedAirport(null);
              setSelectedCheckpoint(null);
              setWaitMinutes(15);
            }}
            className="px-4 py-2 rounded-lg bg-amber/10 text-amber text-sm hover:bg-amber/20 transition-colors board-text"
          >
            Report Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {['airport', 'checkpoint', 'time'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-1 flex-1 rounded-full transition-colors ${
              ['airport', 'checkpoint', 'time'].indexOf(step) >= i
                ? 'bg-amber'
                : 'bg-terminal-border'
            }`} />
          </div>
        ))}
      </div>

      {/* Step: Airport */}
      {step === 'airport' && (
        <div className="animate-fade-in">
          <h2 className="board-text text-xl font-bold text-slate-100 mb-1">Which airport?</h2>
          <p className="text-sm text-slate-500 mb-5">Select the airport you just went through security at.</p>

          <input
            type="text"
            placeholder="Search airports..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-terminal-card border border-terminal-border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber/40 mb-4"
          />

          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
            {filteredAirports.map(airport => (
              <button
                key={airport.id}
                onClick={() => { setSelectedAirport(airport); setStep('checkpoint'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-terminal-card border border-terminal-border hover:border-terminal-border-light hover:bg-terminal-card-hover transition-colors text-left"
              >
                <span className="board-text text-sm font-bold text-amber w-10">{airport.code}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200 truncate">{airport.name}</p>
                  <p className="text-xs text-slate-500">{airport.city}, {airport.state}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Checkpoint */}
      {step === 'checkpoint' && selectedAirport && (
        <div className="animate-fade-in">
          <button onClick={() => setStep('airport')} className="text-xs text-slate-500 hover:text-slate-300 mb-4 inline-block">
            ← Change airport
          </button>
          <h2 className="board-text text-xl font-bold text-slate-100 mb-1">
            Which checkpoint at <span className="text-amber">{selectedAirport.code}</span>?
          </h2>
          <p className="text-sm text-slate-500 mb-5">Pick the security checkpoint you used.</p>

          <div className="space-y-2">
            {selectedAirport.checkpoints.map(cp => (
              <button
                key={cp.id}
                onClick={() => { setSelectedCheckpoint(cp); setStep('time'); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg bg-terminal-card border border-terminal-border hover:border-terminal-border-light hover:bg-terminal-card-hover transition-colors text-left"
              >
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{cp.name}</p>
                </div>
                {cp.isPrecheck && (
                  <span className="px-2 py-0.5 text-[10px] rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 board-text">
                    PRE✓
                  </span>
                )}
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Wait Time */}
      {step === 'time' && selectedAirport && selectedCheckpoint && (
        <div className="animate-fade-in">
          <button onClick={() => setStep('checkpoint')} className="text-xs text-slate-500 hover:text-slate-300 mb-4 inline-block">
            ← Change checkpoint
          </button>
          <h2 className="board-text text-xl font-bold text-slate-100 mb-1">How long did you wait?</h2>
          <p className="text-sm text-slate-500 mb-2">
            <span className="board-text text-amber">{selectedAirport.code}</span> — {selectedCheckpoint.name}
          </p>

          {/* Big number display */}
          <div className="flex flex-col items-center py-10">
            <div className={`board-text text-7xl font-bold ${color} transition-colors`}>
              {waitMinutes}
            </div>
            <span className="text-sm text-slate-500 mt-1">minutes</span>
          </div>

          {/* Slider */}
          <div className="mb-8 px-2">
            <input
              type="range"
              min={0}
              max={120}
              step={1}
              value={waitMinutes}
              onChange={e => setWaitMinutes(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-[10px] text-slate-600 board-text">
              <span>0 min</span>
              <span>30 min</span>
              <span>60 min</span>
              <span>90 min</span>
              <span>120 min</span>
            </div>
          </div>

          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[5, 10, 15, 20, 30, 45, 60].map(m => (
              <button
                key={m}
                onClick={() => setWaitMinutes(m)}
                className={`px-3 py-1.5 rounded-lg text-xs board-text transition-colors ${
                  waitMinutes === m
                    ? 'bg-amber/20 text-amber border border-amber/30'
                    : 'bg-terminal-card border border-terminal-border text-slate-400 hover:text-slate-200 hover:border-terminal-border-light'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-amber text-terminal-bg font-semibold text-sm hover:bg-amber/90 transition-colors board-text"
          >
            Submit Report
          </button>
        </div>
      )}
    </div>
  );
}
