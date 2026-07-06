/**
 * Illustrative industry glyphs — line-art SVGs rendered at any size.
 * Each glyph shares the same 200×200 viewport, ivory stroke on transparent
 * background, so they sit inside the environment without breaking theme.
 */
type Props = { className?: string };

const stroke = "rgba(232,224,210,0.72)";
const glow = "rgba(212,168,116,0.75)";

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id="sgHalo" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(212,168,116,0.22)" />
          <stop offset="70%" stopColor="rgba(212,168,116,0.03)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#sgHalo)" />
      <circle cx="100" cy="100" r="92" fill="none" stroke={stroke} strokeOpacity="0.18" />
      {children}
    </svg>
  );
}

export function SectorGlyph({ slug, className = "" }: { slug: string } & Props) {
  const s = stroke;
  const g = glow;
  switch (slug) {
    case "real-estate":
      return (
        <Frame className={className}>
          {/* Tower silhouettes */}
          <g fill="none" stroke={s} strokeWidth="0.9">
            <rect x="55" y="70" width="18" height="90" />
            <rect x="78" y="55" width="22" height="105" />
            <rect x="105" y="80" width="16" height="80" />
            <rect x="126" y="65" width="20" height="95" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1="55" x2="146" y1={90 + i * 9} y2={90 + i * 9} strokeOpacity="0.35" />
            ))}
            <line x1="40" x2="160" y1="160" y2="160" stroke={g} strokeWidth="1.2" />
          </g>
        </Frame>
      );
    case "technology":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            <rect x="55" y="55" width="90" height="90" rx="2" />
            <rect x="70" y="70" width="60" height="60" rx="1" strokeOpacity="0.5" />
            <circle cx="100" cy="100" r="12" stroke={g} strokeWidth="1.1" />
            {[0, 90, 180, 270].map((r) => (
              <line
                key={r}
                x1="100"
                y1="55"
                x2="100"
                y2="30"
                transform={`rotate(${r} 100 100)`}
              />
            ))}
            {[45, 135, 225, 315].map((r) => (
              <line
                key={r}
                x1="100"
                y1="70"
                x2="100"
                y2="55"
                transform={`rotate(${r} 100 100)`}
                strokeOpacity="0.5"
              />
            ))}
          </g>
        </Frame>
      );
    case "hospitality":
      return (
        <Frame className={className}>
          {/* Hotel façade with lit windows */}
          <g fill="none" stroke={s} strokeWidth="0.9">
            <path d="M50 155 L50 80 L100 55 L150 80 L150 155 Z" />
            <line x1="40" x2="160" y1="155" y2="155" stroke={g} />
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 5 }).map((_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={62 + c * 16}
                  y={95 + r * 18}
                  width="8"
                  height="10"
                  strokeOpacity={(r + c) % 2 === 0 ? 1 : 0.35}
                  fill={(r + c) % 2 === 0 ? "rgba(212,168,116,0.28)" : "none"}
                />
              )),
            )}
          </g>
        </Frame>
      );
    case "luxury":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            <path d="M60 80 L100 50 L140 80 L120 155 L80 155 Z" />
            <path d="M60 80 L140 80" stroke={g} />
            <path d="M100 50 L100 155" strokeOpacity="0.35" />
            <path d="M80 155 L100 80 L120 155" strokeOpacity="0.5" />
          </g>
        </Frame>
      );
    case "media":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="55"
                x2="145"
                y1={70 + i * 10}
                y2={70 + i * 10}
                strokeOpacity={i === 0 ? 1 : 0.35}
                stroke={i === 0 ? g : s}
              />
            ))}
            <rect x="55" y="60" width="90" height="100" strokeOpacity="0.6" />
          </g>
        </Frame>
      );
    case "ventures":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            <polyline
              points="45,150 75,120 100,135 130,80 155,60"
              stroke={g}
              strokeWidth="1.2"
            />
            <line x1="45" x2="155" y1="160" y2="160" />
            {[45, 75, 100, 130, 155].map((x, i) => (
              <circle key={i} cx={x} cy={[150, 120, 135, 80, 60][i]} r="2.4" fill={g} stroke="none" />
            ))}
          </g>
        </Frame>
      );
    case "culture":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={i}
                x1={60 + i * 15}
                x2={60 + i * 15}
                y1="65"
                y2="145"
              />
            ))}
            <path d="M50 60 L150 60 L145 70 L55 70 Z" stroke={g} />
            <line x1="45" x2="155" y1="150" y2="150" />
            <line x1="45" x2="155" y1="155" y2="155" strokeOpacity="0.4" />
          </g>
        </Frame>
      );
    case "capital":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            <circle cx="100" cy="100" r="42" />
            <circle cx="100" cy="100" r="42" stroke={g} strokeDasharray="2 4" />
            <text
              x="100"
              y="112"
              textAnchor="middle"
              fontFamily="serif"
              fontSize="42"
              fill={s}
              stroke="none"
            >
              ∴
            </text>
          </g>
        </Frame>
      );
    case "automotive":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            <path d="M40 120 Q55 90 100 88 Q145 90 160 120 L155 140 L45 140 Z" />
            <circle cx="70" cy="140" r="10" stroke={g} />
            <circle cx="130" cy="140" r="10" stroke={g} />
            <path d="M65 110 Q90 100 135 110" strokeOpacity="0.55" />
          </g>
        </Frame>
      );
    case "airlines":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            <path d="M40 110 L160 100 L40 90 L95 100 Z" stroke={g} />
            <path d="M95 100 L105 60 L115 100" />
            <path d="M95 100 L100 145 L110 100" />
            <path d="M30 130 Q80 80 170 90" strokeOpacity="0.35" strokeDasharray="1 4" />
          </g>
        </Frame>
      );
    case "tourism":
      return (
        <Frame className={className}>
          <g fill="none" stroke={s} strokeWidth="0.9">
            <circle cx="100" cy="100" r="42" />
            <ellipse cx="100" cy="100" rx="42" ry="16" />
            <ellipse cx="100" cy="100" rx="16" ry="42" />
            <path d="M60 88 Q100 78 140 92" stroke={g} />
            <path d="M60 112 Q100 122 140 108" stroke={g} strokeOpacity="0.7" />
          </g>
        </Frame>
      );
    default:
      return (
        <Frame className={className}>
          <circle cx="100" cy="100" r="42" fill="none" stroke={s} />
        </Frame>
      );
  }
}
