// The 2015 shirt art, simplified: a navy bowl on a saucer in the grass with a
// spoon resting in it, dashed steam curls, and "in the park" in a light slab.

const NAVY = "#1E2150";
const GREEN = "#2C6B47";
const GREEN_LIGHT = "#3F8159";
const PRINT = "#F6F1E7";

const STEAM = [
  "M262 128 C 246 110, 278 96, 262 78 C 250 64, 256 44, 272 48 C 284 52, 280 68, 268 66",
  "M320 126 C 300 106, 340 90, 320 70 C 306 56, 316 34, 334 38 C 348 42, 344 60, 330 58",
  "M378 128 C 394 110, 362 96, 378 78 C 390 64, 384 44, 368 48 C 356 52, 360 68, 372 66",
];

// Grass in two layers: lighter blades behind, darker in front of the saucer.
// Blades rise from short at the edges to tall beside the bowl, each curving
// a little to alternating sides. A fixed seed keeps the artwork identical on every render.
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

function grassLayer({ seed, count, from, to, base, minH, maxH, width }: { seed: number; count: number; from: number; to: number; base: number; minH: number; maxH: number; width: number }) {
  const rand = seeded(seed);
  const step = (to - from) / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const x = from + i * step + (rand() - 0.5) * step * 0.6;
    const edge = Math.min(x - from, to - x) / ((to - from) / 2);
    const rise = Math.min(1, edge * 2.2);
    const h = minH + (maxH - minH) * rise * (0.7 + rand() * 0.3);
    const w = width * (0.8 + rand() * 0.4);
    const lean = (i % 2 === 0 ? 1 : -1) * (3 + rand() * 7) + (x - 320) / 30;
    const r = (n: number) => Math.round(n * 10) / 10;
    return `M${r(x - w / 2)} ${base} Q${r(x - w / 4 + lean * 0.2)} ${r(base - h * 0.6)} ${r(x + lean)} ${r(base - h)} Q${r(x + w / 4 + lean * 0.35)} ${r(base - h * 0.5)} ${r(x + w / 2)} ${base} Z`;
  }).join(" ");
}

const BACK_GRASS = grassLayer({ seed: 11, count: 30, from: 60, to: 580, base: 306, minH: 18, maxH: 62, width: 15 });
const FRONT_GRASS = grassLayer({ seed: 29, count: 34, from: 84, to: 556, base: 312, minH: 10, maxH: 30, width: 12 });

function Steam() {
  return (
    <g fill="none" stroke={NAVY} strokeWidth="6" strokeLinecap="round" strokeDasharray="9 8">
      {STEAM.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

function SpoonHandle() {
  // The bowl and rim drawn after it hide the end that sits in the soup
  return <line x1="318" y1="170" x2="118" y2="84" stroke={NAVY} strokeWidth="15" strokeLinecap="round" />;
}

function Bowl() {
  return (
    <>
      <path d="M152 156 H488 C488 236 440 268 380 272 H260 C200 268 152 236 152 156 Z" fill={NAVY} />
      <rect x="140" y="142" width="360" height="18" rx="9" fill={NAVY} />
      <rect x="262" y="266" width="116" height="20" rx="4" fill={NAVY} />
      <rect x="118" y="282" width="404" height="12" rx="6" fill={NAVY} />
    </>
  );
}

function SoupWord() {
  return (
    <text x="320" y="236" textAnchor="middle" fontWeight="800" fontSize="76" letterSpacing="2" fill={PRINT} style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
      SOUP
    </text>
  );
}

// The bowl with SOUP on it, spoon and steam, for the header
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="104 26 424 272" aria-hidden="true">
      <Steam />
      <SpoonHandle />
      <Bowl />
      <SoupWord />
    </svg>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 446" role="img" aria-label="Soup in the Park">
      <Steam />
      <SpoonHandle />
      <path d={BACK_GRASS} fill={GREEN_LIGHT} />
      <Bowl />
      <path d={FRONT_GRASS} fill={GREEN} />

      <SoupWord />
      <text x="320" y="416" textAnchor="middle" fontWeight="300" fontSize="112" fill={PRINT} style={{ fontFamily: "var(--font-zilla), serif" }}>
        in the park
      </text>
    </svg>
  );
}
