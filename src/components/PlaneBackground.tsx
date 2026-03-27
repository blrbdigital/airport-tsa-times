/**
 * Animated planes with curved arc contrails — flight-tracker style.
 * Pure SVG animations, no JS runtime cost.
 */
export default function PlaneBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arc 1 — left to right, upper area, gentle S-curve */}
        <g opacity="0.13">
          <path
            id="arc1"
            d="M-80 220 Q 360 60, 720 280 Q 1080 500, 1520 160"
            fill="none"
            stroke="#c4bfb8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="300 1800"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="2100;-300"
              dur="38s"
              repeatCount="indefinite"
            />
          </path>
          <g>
            <animateMotion dur="38s" repeatCount="indefinite" rotate="auto">
              <mpath xlinkHref="#arc1" />
            </animateMotion>
            <path d="M8 0 L-3 -4 L-1 0 L-3 4 Z" fill="#b5afa7" />
          </g>
        </g>

        {/* Arc 2 — right to left, middle area */}
        <g opacity="0.1">
          <path
            id="arc2"
            d="M1520 400 Q 1080 200, 720 450 Q 360 700, -80 380"
            fill="none"
            stroke="#c4bfb8"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="250 2000"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="2250;-250"
              dur="52s"
              begin="-18s"
              repeatCount="indefinite"
            />
          </path>
          <g>
            <animateMotion dur="52s" begin="-18s" repeatCount="indefinite" rotate="auto">
              <mpath xlinkHref="#arc2" />
            </animateMotion>
            <path d="M8 0 L-3 -3.5 L-1 0 L-3 3.5 Z" fill="#b5afa7" />
          </g>
        </g>

        {/* Arc 3 — left to right, lower area, faster */}
        <g opacity="0.11">
          <path
            id="arc3"
            d="M-80 640 Q 360 480, 720 660 Q 1080 840, 1520 520"
            fill="none"
            stroke="#c4bfb8"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="220 1600"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="1820;-220"
              dur="30s"
              begin="-8s"
              repeatCount="indefinite"
            />
          </path>
          <g>
            <animateMotion dur="30s" begin="-8s" repeatCount="indefinite" rotate="auto">
              <mpath xlinkHref="#arc3" />
            </animateMotion>
            <path d="M7 0 L-2.5 -3 L-0.5 0 L-2.5 3 Z" fill="#b5afa7" />
          </g>
        </g>

        {/* Arc 4 — high and wide, very slow background arc */}
        <g opacity="0.07">
          <path
            id="arc4"
            d="M-80 100 Q 500 -40, 900 180 Q 1300 400, 1520 80"
            fill="none"
            stroke="#c4bfb8"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="350 2400"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="2750;-350"
              dur="65s"
              begin="-30s"
              repeatCount="indefinite"
            />
          </path>
          <g>
            <animateMotion dur="65s" begin="-30s" repeatCount="indefinite" rotate="auto">
              <mpath xlinkHref="#arc4" />
            </animateMotion>
            <path d="M6 0 L-2 -2.5 L-0.5 0 L-2 2.5 Z" fill="#b5afa7" />
          </g>
        </g>
      </svg>
    </div>
  );
}
