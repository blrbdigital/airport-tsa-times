import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { airports, searchAirports } from '../data/airports';
import { getWaitLevel, getWaitColor } from '../lib/types';
import { submitReport } from '../hooks/useWaitTimes';
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

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedAirport || !selectedCheckpoint) return;
    setSubmitting(true);
    setError('');
    try {
      await submitReport(selectedAirport.code, selectedCheckpoint.id, waitMinutes);
      setStep('success');
    } catch (e: any) {
      setError(e?.message || 'Failed to submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-12 sm:py-16 animate-fade-in px-2">
        <div className="w-16 h-16 rounded-full bg-wait-green-bg border-2 border-wait-green flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-wait-green check-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-ink mb-2">Report Submitted</h2>
        <p className="text-sm text-ink-muted mb-1">
          <span className="mono text-coral font-semibold">{selectedAirport?.code}</span> — {selectedCheckpoint?.name}
        </p>
        <p className="text-sm text-ink-faint mb-8">
          You reported a <span className={`mono font-semibold ${color}`}>{waitMinutes} minute</span> wait.
        </p>
        <p className="text-xs text-ink-faint mb-6">Thanks for helping fellow travelers!</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/airport/${selectedAirport?.code.toLowerCase()}`}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-surface border border-border text-sm text-ink font-medium text-center active:bg-surface-hover transition-colors shadow-sm"
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
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-coral text-white text-sm font-semibold text-center active:bg-coral-dark transition-colors shadow-sm"
          >
            Report Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <SEO
        title="Report TSA Wait Time"
        description="Help fellow travelers — report your current TSA security checkpoint wait time. It takes 10 seconds."
        path="/report"
      />

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        {['airport', 'checkpoint', 'time'].map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors ${
              ['airport', 'checkpoint', 'time'].indexOf(step) >= i
                ? 'bg-coral'
                : 'bg-border-light'
            }`} />
          </div>
        ))}
      </div>

      {/* Step: Airport */}
      {step === 'airport' && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-ink mb-1">Which airport?</h2>
          <p className="text-sm text-ink-muted mb-4">Select the airport you went through.</p>

          <input
            type="text"
            placeholder="Search by code, name, or city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-surface border border-border-light rounded-xl px-4 py-3.5 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-coral/40 focus:ring-2 focus:ring-coral/10 mb-3 shadow-sm"
          />

          <div className="space-y-1.5 max-h-[55vh] overflow-y-auto -mx-1 px-1">
            {filteredAirports.map(airport => (
              <button
                key={airport.id}
                onClick={() => { setSelectedAirport(airport); setStep('checkpoint'); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface border border-border-light active:bg-surface-hover transition-colors text-left shadow-sm tap-target"
              >
                <span className="mono text-sm font-bold text-coral w-10">{airport.code}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink truncate">{airport.name}</p>
                  <p className="text-xs text-ink-muted">{airport.city}, {airport.state}</p>
                </div>
                <svg className="w-4 h-4 text-ink-faint flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Checkpoint */}
      {step === 'checkpoint' && selectedAirport && (
        <div className="animate-fade-in">
          <button onClick={() => setStep('airport')} className="text-xs text-ink-muted active:text-ink mb-3 inline-flex items-center gap-1 py-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Change airport
          </button>
          <h2 className="text-xl font-bold text-ink mb-1">
            Checkpoint at <span className="text-coral">{selectedAirport.code}</span>
          </h2>
          <p className="text-sm text-ink-muted mb-4">Which security line did you use?</p>

          <div className="space-y-2">
            {selectedAirport.checkpoints.map(cp => (
              <button
                key={cp.id}
                onClick={() => { setSelectedCheckpoint(cp); setStep('time'); }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl bg-surface border border-border-light active:bg-surface-hover transition-colors text-left shadow-sm tap-target"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{cp.name}</p>
                </div>
                {cp.isPrecheck && (
                  <span className="px-2 py-0.5 text-[10px] rounded-md bg-sky-light text-sky mono font-medium">
                    PRE{'\u2713'}
                  </span>
                )}
                <svg className="w-4 h-4 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          <button onClick={() => setStep('checkpoint')} className="text-xs text-ink-muted active:text-ink mb-3 inline-flex items-center gap-1 py-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Change checkpoint
          </button>

          <div className="text-center mb-2">
            <p className="text-sm text-ink-muted">
              <span className="mono text-coral font-semibold">{selectedAirport.code}</span> — {selectedCheckpoint.name}
            </p>
          </div>

          {/* Big number — the star of the show */}
          <div className="flex flex-col items-center py-8 sm:py-10">
            <div className={`mono text-8xl sm:text-7xl font-bold ${color} transition-colors leading-none`}>
              {waitMinutes}
            </div>
            <span className="text-sm text-ink-muted mt-2">minutes</span>
          </div>

          {/* Slider — big thumb for touch */}
          <div className="mb-6 px-1">
            <input
              type="range"
              min={0}
              max={120}
              step={1}
              value={waitMinutes}
              onChange={e => setWaitMinutes(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-[10px] text-ink-faint mono">
              <span>0</span>
              <span>30</span>
              <span>60</span>
              <span>90</span>
              <span>120</span>
            </div>
          </div>

          {/* Quick select — big tappable pills */}
          <div className="flex flex-wrap gap-2.5 mb-8 justify-center">
            {[5, 10, 15, 20, 30, 45, 60].map(m => (
              <button
                key={m}
                onClick={() => setWaitMinutes(m)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  waitMinutes === m
                    ? 'bg-coral text-white shadow-sm'
                    : 'bg-surface border border-border-light text-ink-muted active:bg-surface-hover'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>

          {error && (
            <p className="text-xs text-wait-red text-center mb-3">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 rounded-full bg-coral text-white font-semibold text-base active:bg-coral-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      )}
    </div>
  );
}
