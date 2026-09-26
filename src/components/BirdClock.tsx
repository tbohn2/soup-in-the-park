"use client";

import { useEffect, useRef, type Ref } from "react";

// Grandma's bird clock: a songbird in place of every hour, under a glass
// dome, keeping the visitor's local time. The birds start at 12, each tinted
// its real color and carrying its call (recordings and credits in public/birds).
const BIRDS = [
  { name: "House Finch", color: "#B8423A", call: "house-finch" },
  { name: "American Robin", color: "#C8612E", call: "american-robin" },
  { name: "Northern Mockingbird", color: "#8A8F96", call: "northern-mockingbird" },
  { name: "Blue Jay", color: "#3F6FB5", call: "blue-jay" },
  { name: "House Wren", color: "#8A5A3B", call: "house-wren" },
  { name: "Tufted Titmouse", color: "#7E8795", call: "tufted-titmouse" },
  { name: "Baltimore Oriole", color: "#E0801E", call: "baltimore-oriole" },
  { name: "Mourning Dove", color: "#B59A7E", call: "mourning-dove" },
  { name: "Black-capped Chickadee", color: "#33343C", call: "black-capped-chickadee" },
  { name: "Northern Cardinal", color: "#B3261E", call: "northern-cardinal" },
  { name: "White-throated Sparrow", color: "#9C7A52", call: "white-throated-sparrow" },
  { name: "White-breasted Nuthatch", color: "#5C7FA3", call: "white-breasted-nuthatch" },
];

// A small perched songbird facing right, centered on 0,0
const BIRD =
  "M-4.6 1.2 C-3.4 -1.8 0 -3 2.4 -2 C3 -3.2 4.4 -3.4 5 -2.4 L6.6 -2 L5.2 -1.1 C5.2 1.6 2.6 3.4 -0.6 3 L-4 4.4 L-3.6 2.4 Z";

const round = (n: number) => Math.round(n * 100) / 100;

// Each bird sits on its hour; those on the left half face inward, like they're watching the hands
const BIRD_MARKS = BIRDS.map((bird, hour) => {
  const angle = (hour / 12) * 2 * Math.PI;
  const x = round(50 + 30 * Math.sin(angle));
  const y = round(50 - 30 * Math.cos(angle));
  const flip = hour > 6 ? -1 : 1;
  return <path key={bird.call} d={BIRD} fill={bird.color} transform={`translate(${x} ${y}) scale(${flip * 1.05} 1.05)`} />;
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
        <linearGradient id="clock-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--navy-light)" }} />
          <stop offset="1" style={{ stopColor: "var(--navy-deep)" }} />
        </linearGradient>
        <radialGradient id="clock-face" cx="0.45" cy="0.4" r="0.65">
          <stop offset="0" style={{ stopColor: "var(--paper)" }} />
          <stop offset="0.75" style={{ stopColor: "var(--print)" }} />
          <stop offset="1" stopColor="#E4D9C2" />
        </radialGradient>
        <linearGradient id="clock-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Cast shadow on the wall, then the rim with a lit top edge and a recessed face */}
      <circle cx="50" cy="55" r="46" fill="rgba(60, 25, 5, 0.28)" />
      <circle cx="50" cy="50" r="47" fill="url(#clock-rim)" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" />
      <circle cx="50" cy="50" r="40.5" style={{ fill: "var(--navy-edge)" }} />
      <circle cx="50" cy="50" r="39.5" fill="url(#clock-face)" />

      {BIRD_MARKS}

      <g ref={handsRef} className="clock-hands" strokeLinecap="round">
        <line className="hand-hour" x1="50" y1="50" x2="50" y2="33" strokeWidth="4.5" />
        <line className="hand-minute" x1="50" y1="50" x2="50" y2="22" strokeWidth="3" />
        <line className="hand-second" x1="50" y1="57" x2="50" y2="20" strokeWidth="1.2" />
      </g>
      <circle cx="50" cy="50" r="3.6" strokeWidth="1.2" style={{ fill: "var(--orange)", stroke: "var(--navy)" }} />

      {/* Light catching the glass dome */}
      <path d="M22 36 C28 20 46 13 62 16 C48 19 34 26 26 40 Z" fill="url(#clock-glass)" />
    </svg>
  );
}
