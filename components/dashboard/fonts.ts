import { Instrument_Sans, Instrument_Serif } from "next/font/google";

// Both are the exact Figma fonts (Google Fonts).
export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--v-font-sans",
  display: "swap",
});
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--v-font-display",
  display: "swap",
});
