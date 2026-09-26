const GRASS_TILE =
  "M0 60 L0 60 L7 6 L10 60 L16 19 L23 60 L27 8 L34 60 L40 8 L44 60 L47 33 L51 60 L58 12 L62 60 L66 24 L69 60 L75 15 L79 60 L84 7 L87 60 L88 32 L94 60 L99 9 L102 60 L106 6 L111 60 L115 28 L122 60 L126 21 L129 60 L133 18 L138 60 L142 29 L151 60 L156 28 L164 60 L168 35 L171 60 L177 24 L178 60 L184 39 L185 60 L192 37 L193 60 L201 24 L203 60 L207 31 L210 60 L215 36 L222 60 L224 23 L231 60 L232 11 L238 60 L239 8 L245 60 L250 32 L253 60 L257 10 L260 60 Z";

// A strip of grass that tiles to any width; sits on the bottom edge of the section above it.
export default function GrassBand({ id }: { id: string }) {
  return (
    <div className="grass" aria-hidden="true">
      <svg width="100%" height="44">
        <defs>
          <pattern id={`${id}-back`} width="260" height="44" patternUnits="userSpaceOnUse" patternTransform="translate(130 0)">
            <path d={GRASS_TILE} transform="translate(0 4) scale(1 0.7)" fill="#3F8159" />
          </pattern>
          <pattern id={id} width="260" height="44" patternUnits="userSpaceOnUse">
            <path d={GRASS_TILE} transform="translate(0 10) scale(1 0.57)" fill="#2C6B47" />
          </pattern>
        </defs>
        {/* Lighter blades behind, darker in front, for depth */}
        <rect width="100%" height="44" fill={`url(#${id}-back)`} />
        <rect width="100%" height="44" fill={`url(#${id})`} />
      </svg>
      <div className="grass-base" />
    </div>
  );
}
