import { useState, useEffect } from 'react';

/**
 * Flight-tracker style background: subtle curved arc lines with planes
 * gliding along them. SVG coordinates match actual viewport pixels so
 * arcs are always visible regardless of screen size/orientation.
 */

interface Flight {
  // Control points as fractions of viewport [0-1]
  start: [number, number];
  cp1: [number, number];
  cp2: [number, number];
  end: [number, number];
  dur: string;
  delay: string;
  opacity: number;
  strokeWidth: number;
  planeScale: number;
}

const FLIGHTS: Flight[] = [
  {
    // Right→left, upper gentle S-curve
    start: [1.05, 0.12],
    cp1: [0.68, 0.34],
    cp2: [0.28, 0.04],
    end: [-0.05, 0.18],
    dur: '34s', delay: '0s', opacity: 0.14, strokeWidth: 1.5, planeScale: 1,
  },
  {
    // Right→left, mid area
    start: [1.05, 0.44],
    cp1: [0.7, 0.24],
    cp2: [0.3, 0.56],
    end: [-0.05, 0.36],
    dur: '44s', delay: '-16s', opacity: 0.1, strokeWidth: 1.2, planeScale: 0.9,
  },
  {
    // Left→right, lower, faster
    start: [-0.05, 0.68],
    cp1: [0.3, 0.54],
    cp2: [0.72, 0.76],
    end: [1.05, 0.58],
    dur: '26s', delay: '-8s', opacity: 0.12, strokeWidth: 1, planeScale: 1.1,
  },
  {
    // Right→left, high and slow
    start: [1.05, 0.08],
    cp1: [0.62, -0.01],
    cp2: [0.3, 0.14],
    end: [-0.05, 0.06],
    dur: '50s', delay: '-28s', opacity: 0.08, strokeWidth: 0.8, planeScale: 0.7,
  },
];

export default function PlaneBackground() {
  const [size, setSize] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    // Only update on significant changes (orientation flip, not scroll jank)
    let raf: number;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setSize(prev => {
          if (Math.abs(prev.w - w) > 50 || Math.abs(prev.h - h) > 100) {
            return { w, h };
          }
          return prev;
        });
      });
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const { w, h } = size;

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        width={w}
        height={h}
        style={{ position: 'absolute', top: 0, left: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Plane silhouette definition — Material airplane, rotated to point right */}
        <defs>
          <g id="plane-shape">
            <path
              d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              fill="#a09890"
              transform="rotate(90 12 12)"
            />
          </g>
        </defs>

        {FLIGHTS.map((f, i) => {
          const d = [
            `M ${f.start[0] * w} ${f.start[1] * h}`,
            `C ${f.cp1[0] * w} ${f.cp1[1] * h},`,
            `${f.cp2[0] * w} ${f.cp2[1] * h},`,
            `${f.end[0] * w} ${f.end[1] * h}`,
          ].join(' ');

          const s = f.planeScale * 0.55;

          return (
            <g key={`${i}-${w}-${h}`} opacity={f.opacity}>
              {/* The visible arc trail */}
              <path
                id={`fp-${i}`}
                d={d}
                fill="none"
                stroke="#c4bfb8"
                strokeWidth={f.strokeWidth}
                strokeLinecap="round"
              />

              {/* Plane silhouette gliding along the arc */}
              <g>
                <animateMotion
                  dur={f.dur}
                  begin={f.delay}
                  repeatCount="indefinite"
                  rotate="auto"
                  calcMode="linear"
                >
                  <mpath href={`#fp-${i}`} />
                </animateMotion>
                <use href="#plane-shape" transform={`scale(${s}) translate(-12, -12)`} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
