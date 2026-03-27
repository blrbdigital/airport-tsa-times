/**
 * Animated planes with curved contrails drifting across the screen.
 * Pure CSS animations with % positioning — works on any viewport.
 */
export default function PlaneBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Flight 1 — left to right, upper area */}
      <div className="flight flight-1">
        <div className="flight-body">
          <div className="flight-trail" />
          <PlaneIcon />
        </div>
      </div>

      {/* Flight 2 — right to left, mid area */}
      <div className="flight flight-2">
        <div className="flight-body flight-flip">
          <div className="flight-trail" />
          <PlaneIcon />
        </div>
      </div>

      {/* Flight 3 — left to right, lower area, faster */}
      <div className="flight flight-3">
        <div className="flight-body">
          <div className="flight-trail" />
          <PlaneIcon />
        </div>
      </div>

      {/* Flight 4 — right to left, high, very slow */}
      <div className="flight flight-4">
        <div className="flight-body flight-flip">
          <div className="flight-trail flight-trail-short" />
          <PlaneIcon small />
        </div>
      </div>
    </div>
  );
}

function PlaneIcon({ small }: { small?: boolean }) {
  return (
    <svg
      className={small ? 'w-3.5 h-3.5' : 'w-5 h-5'}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ transform: 'rotate(-45deg)', flexShrink: 0 }}
    >
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}
