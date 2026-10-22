// Simple 1.5px line icons (Figma sidebar style).
type P = { size?: number };
const base = (size: number) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const });

export const GemIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M6 3h12l3 6-9 12L3 9z" /><path d="M3 9h18M12 21L8 9l4-6 4 6-4 12" /></svg>
);
export const IntroIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}><path d="M17 3l4 4-4 4" /><path d="M3 7h18" /><path d="M7 21l-4-4 4-4" /><path d="M21 17H3" /></svg>
);
export const MicIcon = ({ size = 16 }: P) => (
  <svg {...base(size)}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></svg>
);
export const ArrowCircleIcon = ({ size = 14 }: P) => (
  <svg {...base(size)} strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 16l4-4-4-4M8 12h8" /></svg>
);
export const ChevronIcon = ({ size = 14 }: P) => (
  <svg {...base(size)} stroke="rgba(0,0,0,0.6)" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
);
export const CopyIcon = ({ size = 14 }: P) => (
  <svg {...base(size)} strokeWidth={2}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></svg>
);
export const CheckIcon = ({ size = 14 }: P) => (
  <svg {...base(size)} strokeWidth={2}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
