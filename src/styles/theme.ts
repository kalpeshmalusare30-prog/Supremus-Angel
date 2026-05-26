// Design tokens — UI/UX Brief layout language skinned with the Stitch
// indigo palette and the tri-font system (Geist / Inter / JetBrains Mono).

export const theme = {
  colors: {
    // Brand — "Functional Purples": indigo→violet for input & creation.
    primary: '#4648d4',
    primaryHover: '#3a3cbf',
    primaryActive: '#2f2ebe',
    primarySoft: '#e1e0ff', // tinted backgrounds, badges, focus glow base
    primaryContainer: '#6063ee',
    onPrimary: '#ffffff',
    secondary: '#4b41e1',
    tertiary: '#8127cf',

    // Neutrals — structural scaffolding (Stitch tonal layers).
    background: '#f9fafb', // app floor (elevation level 0)
    surface: '#ffffff', // cards / form rows (level 1)
    surfaceMuted: '#f9fafb',
    surfaceContainer: '#f1f3ff', // subtle tinted container
    border: '#e5e7eb',
    borderStrong: '#c7c4d7',

    text: '#111827',
    textMuted: '#4b5563',
    textSubtle: '#9ca3af',

    // Semantic — state only, never decorative.
    danger: '#ba1a1a',
    dangerSoft: '#ffdad6',
    onDanger: '#ffffff',
    success: '#2e7d32',
    warning: '#ed6c02',
    info: '#0288d1',

    // Surfaces for floating UI.
    tooltipBg: 'rgba(20, 27, 43, 0.92)',
    tooltipText: '#edf0ff',
    overlay: 'rgba(17, 24, 39, 0.4)',
  },

  fonts: {
    heading: 'var(--font-geist), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: 'var(--font-mono), "JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },

  // Type scale (UI/UX Brief §5.2), anchored at 16px / 1.25 ratio.
  fontSizes: {
    display: '32px',
    h1: '24px',
    h2: '20px',
    body: '16px',
    bodySm: '14px',
    caption: '12px',
  },
  lineHeights: {
    display: '40px',
    h1: '32px',
    h2: '28px',
    body: '24px',
    bodySm: '20px',
    caption: '16px',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacings: {
    tight: '-0.01em',
    label: '0.05em',
  },

  // 4px base unit (UI/UX Brief §7).
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
  },

  // Soft-geometric shapes (UI/UX Brief §8).
  radii: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },

  // Subtle elevation / tonal layers (Stitch DESIGN §Elevation).
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 20px rgba(0, 0, 0, 0.04)',
    lg: '0 8px 24px rgba(70, 72, 212, 0.10)',
    focus: '0 0 0 3px rgba(70, 72, 212, 0.15)',
  },

  transitions: {
    fast: '120ms ease-out',
    base: '200ms ease-out',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  layout: {
    containerMax: '1280px',
    navHeight: '64px',
    sideNavWidth: '64px',
    columnMax: '720px',
  },

  zIndices: {
    base: 1,
    sideNav: 40,
    topNav: 50,
    tooltip: 60,
  },
} as const;

export type AppTheme = typeof theme;
