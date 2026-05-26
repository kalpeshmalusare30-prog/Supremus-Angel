// Responsive breakpoints (UI/UX Brief §12.1).
export const breakpoints = {
  mobile: 640, // ≤ 640px
  tablet: 1024, // 641 – 1024px ; desktop is ≥ 1025px
} as const;

export const bp = {
  mobile: `(max-width: ${breakpoints.mobile}px)`,
  tablet: `(min-width: ${breakpoints.mobile + 1}px) and (max-width: ${breakpoints.tablet}px)`,
  desktop: `(min-width: ${breakpoints.tablet + 1}px)`,
  // Mobile-first min-width helpers.
  upTablet: `(min-width: ${breakpoints.mobile + 1}px)`,
  upDesktop: `(min-width: ${breakpoints.tablet + 1}px)`,
} as const;

/** Ready-to-interpolate media query strings: `${media.upDesktop} { ... }`. */
export const media = {
  mobile: `@media ${bp.mobile}`,
  tablet: `@media ${bp.tablet}`,
  desktop: `@media ${bp.desktop}`,
  upTablet: `@media ${bp.upTablet}`,
  upDesktop: `@media ${bp.upDesktop}`,
} as const;
