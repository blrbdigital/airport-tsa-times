import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAirports } from '../data/airports';
import type { Airport } from '../lib/types';

interface SearchBarProps {
  large?: boolean;
  placeholder?: string;
}

export default function SearchBar({ large = false, placeholder = 'Search airports by name, code, or city...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 1) {
      const matches = searchAirports(query).slice(0, 8);
      setResults(matches);
      setIsOpen(matches.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/airport/${airport.code.toLowerCase()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <svg className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint ${large ? 'w-5 h-5' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query.length >= 1 && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-surface border border-border rounded-xl text-ink placeholder-ink-faint focus:outline-none focus:border-coral/40 focus:ring-2 focus:ring-coral/10 transition-all shadow-sm ${
            large ? 'pl-12 pr-4 py-3.5 text-base' : 'pl-10 pr-4 py-2.5 text-sm'
          }`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink-muted transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-lg overflow-hidden animate-fade-in"
        >
          {results.map((airport, i) => (
            <button
              key={airport.id}
              onClick={() => handleSelect(airport)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                i === selectedIndex ? 'bg-cream-dark' : 'hover:bg-surface-hover'
              } ${i < results.length - 1 ? 'border-b border-border-light' : ''}`}
            >
              <span className="mono text-sm font-bold text-coral w-10 flex-shrink-0">
                {airport.code}
              </span>
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
      )}
    </div>
  );
}
