interface Props { level: number; capacity: number; }

export function ReservoirElevationProfile({ level, capacity }: Props) {
  const waterY = Math.max(90, Math.min(220, 255 - (level - 420) * 2.3));
  return (
    <section className="panel overflow-hidden p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="eyebrow">Catchment cross-section</p>
          <h2 className="text-lg font-semibold">Reservoir elevation profile</h2>
        </div>
        <span className="metric text-lake">{capacity.toFixed(1)}% stored</span>
      </div>
      <svg viewBox="0 0 650 300" className="w-full" role="img"
        aria-label="Illustrative reservoir cross-section showing water level and dam wall">
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#49b0ba" />
            <stop offset="1" stopColor="#065d78" />
          </linearGradient>
          <clipPath id="basin"><path d="M0 75L140 198L270 251L470 260L560 70V300H0Z" /></clipPath>
        </defs>
        <path d="M0 75L140 198L270 251L470 260L560 70" fill="none"
          stroke="#a8b8a0" strokeWidth="18" strokeLinejoin="round" />
        <rect x="0" y={waterY} width="565" height={300-waterY} fill="url(#water)"
          clipPath="url(#basin)" />
        <path d={`M0 ${waterY} H557`} stroke="#83e2de" strokeWidth="2"
          strokeDasharray="7 5" />
        <path d="M559 45L589 45L611 275H549Z" fill="#253f48" />
        <path d="M559 45L589 45L611 275H549Z" stroke="#4b6a6e" strokeWidth="3"
          fill="none" />
        <path d="M612 205H650" stroke="#2099ad" strokeWidth="12" />
        <text x="20" y={waterY-10} fontSize="12" fill="#246777">
          CURRENT POOL {level.toFixed(1)} m
        </text>
        <text x="535" y="25" fontSize="11" fill="#425b59">CREST</text>
        <text x="25" y="285" fontSize="11" fill="#56706b">SCHEMATIC / NOT TO SCALE</text>
      </svg>
      <div className="mt-3 grid grid-cols-3 divide-x text-center text-sm">
        <div><p className="eyebrow">Normal pool</p><p className="metric">475.0 m</p></div>
        <div><p className="eyebrow">Active storage</p><p className="metric">640 Mm³</p></div>
        <div><p className="eyebrow">Sediment reserve</p><p className="metric">65 Mm³</p></div>
      </div>
    </section>
  );
}
