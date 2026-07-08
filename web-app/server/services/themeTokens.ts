// ═══════════════════════════════════════════════════════════════════════════════
// FASTR brand color tokens — single source of truth
// ═══════════════════════════════════════════════════════════════════════════════
// These hex values are duplicated (by necessity) across the render surfaces:
//   • fastr-theme.css :root            — the Marp deck theme (HTML preview + PDF)
//   • FASTR Design System/…            — the documented palette
//   • this file                        — the native PPTX generator (no CSS path)
//
// This file is the CANONICAL copy. pptxGenerator imports COLORS from here, and
// themeTokens.test.ts fails loudly if the CSS files drift from these values — so
// a palette change is made here once and the test catches any un-mirrored copy.
//
// Hex strings carry NO leading '#' (pptxgenjs wants bare hex). FONTS/LAYOUT stay
// in pptxGenerator: fonts deliberately differ (Calibri for PPTX vs Poppins for
// CSS, since fonts can't embed in .pptx), so they are not shared tokens.

export const COLORS = {
  deepGreen: '09544F',    // H1
  darkGreen: '0C716B',    // primary
  green: '1F9A9C',
  lime: 'D0CB17',         // accent/underline
  navy: '21568C',         // H2
  blue: '1A90C0',         // H2 underline
  lightBlue: 'CAE6E9',    // table headers
  lightGreen: 'E8F4F3',   // session headers (PPTX-only; no CSS var)
  gold: 'D8A822',
  purple: '7A1F6E',
  orchid: 'BD5091',
  coral: 'FF6462',
  textDark: '2c3e50',
  darkGray: '333333',     // PPTX-only; no CSS var
  white: 'FFFFFF',
  // 2026 refresh tokens (mirror fastr-theme.css :root)
  ink: '1A1F1E',          // body text
  ink2: '5A6562',         // secondary
  ink3: '97A09D',         // tertiary / chrome
  paper2: 'F6F5EF',       // warm panel (breaks, callouts)
  green900: '063D39',     // dark slides
  rule: 'E4E7E5',         // hairline
} as const

export type ColorToken = keyof typeof COLORS

// Where each token appears as a CSS custom property, per file, for the drift
// guard. Tokens with no CSS counterpart (PPTX-only, e.g. lightGreen/darkGray)
// are simply absent here. Keyed by token → CSS var name in that file.
export const CSS_VAR_MAP: Record<string, Partial<Record<ColorToken, string>>> = {
  'fastr-theme.css': {
    deepGreen: '--fastr-deep-green',
    darkGreen: '--fastr-dark-green',
    green: '--fastr-green',
    lime: '--fastr-lime',
    navy: '--fastr-navy',
    blue: '--fastr-blue',
    lightBlue: '--fastr-light-blue',
    gold: '--fastr-gold',
    purple: '--fastr-purple',
    orchid: '--fastr-orchid',
    coral: '--fastr-coral',
    textDark: '--text-dark',
    white: '--bg-white',
    ink: '--ink',
    ink2: '--ink-2',
    ink3: '--ink-3',
    paper2: '--paper-2',
    green900: '--green-900',
    rule: '--rule-hairline',
  },
  'FASTR Design System/colors_and_type.css': {
    deepGreen: '--fastr-deep-green',
    darkGreen: '--fastr-dark-green',
    green: '--fastr-green',
    lime: '--fastr-lime',
    navy: '--fastr-navy',
    blue: '--fastr-blue',
    lightBlue: '--fastr-light-blue',
    gold: '--fastr-gold',
    purple: '--fastr-purple',
    orchid: '--fastr-orchid',
    coral: '--fastr-coral',
    textDark: '--fg-1',
    white: '--bg-1',
    ink: '--ink',
    ink2: '--ink-2',
    ink3: '--ink-3',
    paper2: '--paper-2',
    green900: '--green-900',
    rule: '--rule-hairline',
  },
}
