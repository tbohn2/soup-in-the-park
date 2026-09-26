"use client";

import { useEffect, useRef, type Ref } from "react";

// Grandma's bird clock: a green rim and silver bezel around a cream face, a
// songbird perched on a twig at every hour, and black spade hands keeping the
// visitor's local time. Each bird carries its call (recordings and credits in
// public/birds).

type Bird = {
  name: string;
  call: string;
  back: string;
  belly: string;
  head?: string;
  cap?: string;
  bib?: string;
  crest?: boolean;
  tail: keyof typeof TAILS;
  beak?: string;
  eye?: string;
};

const BLACK = "#1E1E22";

// Starting at 12, in the order they sit on the real clock
const BIRDS: Bird[] = [
  { name: "House Finch", call: "house-finch", back: "#8B6F5A", belly: "#E6DACB", head: "#C0392B", bib: "#C0392B", tail: "short" },
  { name: "American Robin", call: "american-robin", back: "#5A534D", belly: "#D0652E", head: "#2D2A28", tail: "short", beak: "#E0B030", eye: "#F7F5F0" },
  { name: "Northern Mockingbird", call: "northern-mockingbird", back: "#8C8F93", belly: "#E8E6E0", tail: "long" },
  { name: "Blue Jay", call: "blue-jay", back: "#3F74C4", belly: "#EDEFF2", crest: true, tail: "long" },
  { name: "House Wren", call: "house-wren", back: "#8A5E3E", belly: "#C9A884", tail: "cocked" },
  { name: "Tufted Titmouse", call: "tufted-titmouse", back: "#8E97A5", belly: "#EEEBE6", crest: true, tail: "short" },
  { name: "Baltimore Oriole", call: "baltimore-oriole", back: BLACK, belly: "#EE8A1A", tail: "short", eye: "#F7F5F0" },
  { name: "Mourning Dove", call: "mourning-dove", back: "#B7A083", belly: "#D9C6AE", tail: "long" },
  { name: "Black-capped Chickadee", call: "black-capped-chickadee", back: "#8E949A", belly: "#EFE9DF", head: "#F7F5F0", cap: BLACK, bib: BLACK, tail: "short" },
  { name: "Northern Cardinal", call: "northern-cardinal", back: "#B8281E", belly: "#D0402F", crest: true, bib: BLACK, tail: "long", beak: "#E8742A" },
  { name: "White-throated Sparrow", call: "white-throated-sparrow", back: "#8A6A48", belly: "#CFC2B0", bib: "#F5F2EA", tail: "short" },
  { name: "White-breasted Nuthatch", call: "white-breasted-nuthatch", back: "#7E97B3", belly: "#F3F1EC", head: "#F3F1EC", cap: BLACK, tail: "short" },
];

// Bird parts, facing right around 0,0
const TAILS = {
  short: "M-3.8 0.4 L-7.2 -0.8 L-6.8 1.6 Z",
  long: "M-3.8 0.3 L-9.2 -0.7 L-8.9 1.4 Z",
  cocked: "M-3.4 -0.2 L-6 -3.8 L-4.6 -4.2 L-2.6 -0.8 Z",
};
const BACK = "M-4.2 0.4 C-3 -2.5 1 -3.2 3 -1.6 C1.6 0.2 -1 1.4 -4.2 0.4 Z";
const CAP = "M1.3 -2.1 A2.1 2.1 0 0 1 5.5 -2.1 Z";
const CREST = "M1.9 -3.1 L2.2 -5.6 L4 -3.7 Z";
const BEAK = "M5.3 -2.5 L7 -1.9 L5.3 -1.4 Z";

function BirdMark({ bird }: { bird: Bird }) {
  const head = bird.head ?? bird.back;
  return (
    <>
      {/* The twig it's perched on */}
      <path d="M-4.6 3.7 L4.8 4.2" stroke="#7A5A3C" strokeWidth="0.9" strokeLinecap="round" />
      <path d={TAILS[bird.tail]} fill={bird.back} />
      <ellipse cx="0" cy="0.8" rx="4.4" ry="3" transform="rotate(-12)" fill={bird.belly} />
      <path d={BACK} fill={bird.back} />
      {bird.crest && <path d={CREST} fill={head} />}
      <circle cx="3.4" cy="-2" r="2.1" fill={head} />
      {bird.cap && <path d={CAP} fill={bird.cap} />}
      {bird.bib && <ellipse cx="4.3" cy="-0.7" rx="1.2" ry="0.9" fill={bird.bib} />}
      <path d={BEAK} fill={bird.beak ?? "#3A3A3A"} />
      <circle cx="4" cy="-2.3" r="0.45" fill={bird.eye ?? BLACK} />
    </>
  );
}

// The clock's rings, from the outside in
const RIM = 47;
const FACE = 40.3;
const DOT_RING = 37;
const PERCH_RING = 28.5;

const round = (n: number) => Math.round(n * 100) / 100;
const onHour = (hour: number, radius: number) => {
  const angle = (hour / 12) * 2 * Math.PI;
  return { x: round(50 + radius * Math.sin(angle)), y: round(50 - radius * Math.cos(angle)) };
};

// Built once: the birds sit inside a ring of hour dots, all facing inward
// like they're watching the hands.
const FACE_MARKS = BIRDS.map((bird, hour) => {
  const perch = onHour(hour, PERCH_RING);
  const dot = onHour(hour, DOT_RING);
  const flip = hour > 0 && hour < 6 ? -1 : 1;
  return (
    <g key={bird.call}>
      <circle cx={dot.x} cy={dot.y} r="0.75" fill={BLACK} />
      <g transform={`translate(${perch.x} ${perch.y}) scale(${flip * 0.92} 0.92)`}>
        <BirdMark bird={bird} />
      </g>
    </g>
  );
});

// Like the clock striking the hour: one of its birds sings. A new click cuts
// off the last song so they never pile up. Each call loads on its first play.
const calls = new Map<string, HTMLAudioElement>();
let singing: HTMLAudioElement | null = null;

export function playRandomCall() {
  const bird = BIRDS[Math.floor(Math.random() * BIRDS.length)];
  let call = calls.get(bird.call);
  if (!call) {
    call = new Audio(`/birds/${bird.call}.mp3`);
    calls.set(bird.call, call);
  }
  singing?.pause();
  singing = call;
  call.currentTime = 0;
  call.play().catch((err) => console.error(`Couldn't play the ${bird.name} call:`, err));
}

export default function BirdClock({ className, ref }: { className?: string; ref?: Ref<SVGSVGElement> }) {
  const handsRef = useRef<SVGGElement>(null);

  // The server can't know the visitor's time, so the hands wait for the mount.
  // From there CSS keeps them turning: each hand's animation starts part-way
  // through its turn, so there's no timer re-rendering the clock every second.
  useEffect(() => {
    const hands = handsRef.current;
    if (!hands) return;
    const now = new Date();
    const intoTurn = (now.getHours() % 12) * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
    hands.style.setProperty("--into-turn", `-${intoTurn}s`);
    hands.dataset.set = "true";
  }, []);

  return (
    <svg ref={ref} className={className} viewBox="0 0 100 104" aria-hidden="true">
      <defs>
        {/* Rounded green rim: dark at both edges, lit along its crown */}
        <radialGradient id="clock-rim" gradientUnits="userSpaceOnUse" cx="50" cy="50" r={RIM}>
          <stop offset={FACE / RIM} stopColor="#173828" />
          <stop offset="0.91" stopColor="#3E7A5E" />
          <stop offset="0.96" stopColor="#2A5C44" />
          <stop offset="1" stopColor="#123022" />
        </radialGradient>
        <linearGradient id="clock-rim-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.3" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="clock-bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4F5F7" />
          <stop offset="0.5" stopColor="#A6ABB1" />
          <stop offset="1" stopColor="#E2E4E7" />
        </linearGradient>
        <radialGradient id="clock-face" cx="0.45" cy="0.4" r="0.65">
          <stop offset="0" style={{ stopColor: "var(--print)" }} />
          <stop offset="1" stopColor="#E3DDCB" />
        </radialGradient>
        <radialGradient id="clock-pin" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#F3D98A" />
          <stop offset="1" stopColor="#9A7424" />
        </radialGradient>
        <linearGradient id="clock-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Cast shadow on the wall, the rim, its silver bezel, then the face */}
      <circle cx="50" cy="55" r="46" fill="rgba(60, 25, 5, 0.28)" />
      <circle cx="50" cy="50" r={RIM} fill="url(#clock-rim)" />
      <circle cx="50" cy="50" r={(RIM + FACE) / 2} fill="none" stroke="url(#clock-rim-light)" strokeWidth={RIM - FACE} />
      <circle cx="50" cy="50" r={FACE} fill="url(#clock-face)" stroke="url(#clock-bezel)" strokeWidth="1.4" />
      {/* The speaker the birds sing through, just inside the 12 o'clock dot */}
      <circle cx="50" cy={50 - DOT_RING + 3.2} r="0.9" fill="#4A4A4E" />

      {FACE_MARKS}

      <g ref={handsRef} className="clock-hands" fill={BLACK}>
        <path className="hand-hour" d="M49.2 52 L49.2 38 C47.2 36.6 47.6 33.6 50 31 C52.4 33.6 52.8 36.6 50.8 38 L50.8 52 Z" />
        <path className="hand-minute" d="M49.4 53 L49.4 24.5 C48 23 48.4 20.8 50 18.2 C51.6 20.8 52 23 50.6 24.5 L50.6 53 Z" />
        <line className="hand-second" x1="50" y1="58" x2="50" y2="17.5" stroke={BLACK} strokeWidth="0.6" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="50" r="2.2" fill="url(#clock-pin)" stroke={BLACK} strokeWidth="0.5" />

      {/* Light catching the glass dome */}
      <path d="M22 36 C28 20 46 13 62 16 C48 19 34 26 26 40 Z" fill="url(#clock-glass)" />
    </svg>
  );
}
