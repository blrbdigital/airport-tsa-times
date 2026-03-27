/**
 * Subtle animated planes with contrails drifting across the background.
 * Pure CSS animations — no JS, no performance hit.
 */
export default function PlaneBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Plane 1 — slow, high */}
      <div className="plane plane-1">
        <div className="plane-trail" />
        <PlaneIcon />
      </div>

      {/* Plane 2 — medium, mid */}
      <div className="plane plane-2">
        <div className="plane-trail" />
        <PlaneIcon />
      </div>

      {/* Plane 3 — fast, low */}
      <div className="plane plane-3">
        <div className="plane-trail" />
        <PlaneIcon />
      </div>
    </div>
  );
}

function PlaneIcon() {
  return (
    <svg className="plane-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}
