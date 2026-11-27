// Hand-drawn icons for the Christmas sign-up page, in the page palette with the
// same ink outline as the cards. Decorative only, so hidden from screen readers.
const INK = "#23302a";
const RED = "#c41e3a";
const GREEN = "#165b33";
const GOLD = "#f8b229";
const PAPER = "#fffdf8";
const WOOD = "#7a4a2b";

const iconProps = {
  viewBox: "0 0 32 32",
  "aria-hidden": "true",
  focusable: "false",
};

const outline = {
  stroke: INK,
  strokeWidth: 1.75,
  strokeLinejoin: "round",
  strokeLinecap: "round",
};

export const ChristmasTree = () => (
  <svg
    viewBox="0 0 40 50"
    aria-hidden="true"
    focusable="false"
  >
    <g stroke={INK} strokeWidth="1.5" strokeLinejoin="round">
      <rect x="17" y="42" width="6" height="7" fill={WOOD} />
      <path d="M20 23 L38 43 H2 Z" fill={GREEN} />
      <path d="M20 15 L34 31 H6 Z" fill="#1d7041" />
      <path d="M20 9 L30 21 H10 Z" fill="#23864e" />
      <polygon
        points="20,1.5 21.35,5.14 25.23,5.3 22.19,7.71 23.23,11.45 20,9.3 16.77,11.45 17.81,7.71 14.77,5.3 18.65,5.14"
        fill={GOLD}
      />
    </g>
    <circle cx="14" cy="38" r="1.9" fill={RED} />
    <circle cx="26" cy="36" r="1.9" fill={GOLD} />
    <circle cx="23" cy="27" r="1.7" fill={RED} />
    <circle cx="16" cy="25" r="1.6" fill={GOLD} />
    <circle cx="21" cy="17" r="1.4" fill={RED} />
  </svg>
);

export const TacoIcon = () => (
  <svg {...iconProps}>
    <g {...outline}>
      <path
        d="M5 15 Q7 8 10.5 11 Q12.5 6 16 9 Q19.5 6 21.5 11 Q25 8 27 15 Z"
        fill="#3f9b4f"
      />
      <circle cx="11.5" cy="11.5" r="1.8" fill={RED} />
      <circle cx="20" cy="11" r="1.8" fill={RED} />
      <path d="M3 15 A13 12 0 0 0 29 15 Z" fill={GOLD} />
    </g>
  </svg>
);

export const GiftIcon = () => (
  <svg {...iconProps}>
    <g {...outline}>
      <path d="M16 10 C11 3 6 6 10.5 10 Z" fill={GOLD} />
      <path d="M16 10 C21 3 26 6 21.5 10 Z" fill={GOLD} />
      <rect x="6" y="15" width="20" height="13" fill={RED} />
      <rect x="4" y="10" width="24" height="5.5" fill={RED} />
      <rect x="14" y="10" width="4" height="18" fill={GOLD} />
    </g>
  </svg>
);

export const SantaHatIcon = () => (
  <svg {...iconProps}>
    <g {...outline}>
      <path d="M6 23 Q9 9 20 5 Q25 12 26 23 Z" fill={RED} />
      <rect x="4" y="22" width="24" height="6" rx="3" fill={PAPER} />
      <circle cx="20" cy="5.5" r="3" fill={PAPER} />
    </g>
  </svg>
);

export const LawnChairIcon = () => (
  <svg {...iconProps}>
    <g {...outline}>
      <path d="M9 21 L6 29" fill="none" />
      <path d="M23 21 L26 29" fill="none" />
      <path d="M7 4 L12 4 L13.5 19 L9 19 Z" fill={GREEN} />
      <path d="M8.5 17.5 H25 V21.5 H8.5 Z" fill={GREEN} />
      <path d="M11 11.5 H24 V17.5" fill="none" />
    </g>
  </svg>
);

export const ShepherdCrookIcon = () => (
  <svg {...iconProps}>
    <path
      d="M19 29 V12 C19 4.5 10 4.5 10 11"
      fill="none"
      stroke={INK}
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M19 29 V12 C19 4.5 10 4.5 10 11"
      fill="none"
      stroke={WOOD}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
