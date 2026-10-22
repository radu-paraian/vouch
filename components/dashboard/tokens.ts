// Design tokens extracted from Kevin's Figma file "Vault" (8QVuPNTYwdeh0Al182j886),
// frames 280:4478 and 286:7252. Mirrored as CSS variables in dashboard.css.
export const tokens = {
  color: {
    canvas: "#eceaea", // page background behind the shell
    shell: "#ffffff", // outer white card holding the sidebar rail
    panel: "#f7f7f7", // main content panel
    surface: "#ffffff", // raised card (white, 1px #f7f7f7 top highlight)
    tile: "#f7f7f7", // inner tile (2px white top highlight)
    badge: "#f4f4f4", // soft status badge / input border
    track: "#dcdbdb", // progress track
    barMuted: "#dcdcdc", // muted bar fill
    ink: "#000000",
    ink90: "rgba(0,0,0,0.9)",
    ink60: "rgba(0,0,0,0.6)", // secondary text (most common text colour in file)
    line: "rgba(0,0,0,0.1)", // borders + dividers
    lineStrong: "rgba(0,0,0,0.6)", // count-badge ring / outlined status pill
    placeholder: "#a7a7a7",
    charcoal: "#353535", // sidebar rail, active bars, count dot
    btnFrom: "#3b3c40", // primary button gradient top
    btnTo: "#1d1e22", // primary button gradient bottom
    btnHighlight: "#5c5d61", // primary button 2px top border
    railFrom: "#505050",
    railVia: "#282828",
    railTo: "#181818",
  },
  font: {
    display: "Instrument Serif", // 400, 50px page titles
    sans: "Instrument Sans", // 400 / 500
  },
  fontSize: { xxs: 8, xs: 10, sm: 12, base: 14, md: 16, lg: 24, xl: 36, xxl: 42, display: 50 },
  radius: { sm: 5, md: 8, lg: 15, pill: 25, full: 100 },
  space: { 2: 2, 5: 5, 8: 8, 10: 10, 12: 12, 15: 15, 20: 20, 24: 24, 30: 30, 52: 52 },
  shadow: {
    shell: "0px 4px 18.6px 0px rgba(0,0,0,0.18)",
    panel: "0px 4px 11.4px 0px rgba(0,0,0,0.18)",
    rail: "1px 3px 11.8px 1px rgba(0,0,0,0.4)",
    railButton: "0px 4px 4px 0px rgba(0,0,0,0.25)",
  },
} as const;
