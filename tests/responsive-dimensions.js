/**
 * Responsive coverage is based on CSS viewport dimensions, not physical panel
 * pixels. Device pixel ratio changes image sharpness but CSS media queries and
 * layout use these logical viewport dimensions.
 *
 * The ranges deliberately cover audiences rather than chasing a device list:
 * new hardware appears every year, while these layout classes stay relevant.
 */
export const WIDTH_RANGES = [
  {
    from: 320,
    to: 479,
    step: 8,
    label: 'phone',
    represents:
      'Legacy compact phones and narrow webviews through current Android and iPhone flagships (roughly 320, 360, 390, 402, 412, and 440 CSS px).',
  },
  {
    from: 480,
    to: 649,
    step: 8,
    label: 'intermediate',
    represents:
      'Large-phone landscape, foldable panes, small tablets, zoomed browsers, and narrow split-screen windows; this device-light gap is where fluid layouts commonly fail.',
  },
  {
    from: 650,
    to: 900,
    step: 8,
    label: 'single-column-tablet',
    represents:
      'Portrait tablets, large foldables, and narrow desktop windows that still use the one-column composition.',
  },
  {
    from: 901,
    to: 1100,
    step: 8,
    label: 'compact-two-column',
    represents:
      'Tablet landscape, compact laptops, and side-by-side desktop windows immediately after the two-column breakpoint.',
  },
  {
    from: 1101,
    to: 1439,
    step: 8,
    label: 'laptop',
    represents:
      'Common 1280px and 1366px laptop displays, including users with browser sidebars or modest window resizing.',
  },
  {
    from: 1440,
    to: 1920,
    step: 8,
    label: 'desktop',
    represents:
      'Modern desktop and full-HD displays, including the wide layouts where spacing and maximum-size caps matter most.',
  },
];

/**
 * Width alone is insufficient because the phone mockup uses svh sizing.
 * These profiles exercise constrained, typical, tall-phone, and desktop
 * heights without creating an unnecessarily slow every-width/every-height
 * Cartesian product.
 */
export const HEIGHT_PROFILES = [
  {
    height: 568,
    label: 'short',
    represents:
      'First-generation iPhone SE-class screens, phone landscape, split windows, and laptop windows with heavy browser chrome.',
  },
  {
    height: 780,
    label: 'standard',
    represents:
      'High-volume budget and mid-range Android phones plus compact laptop windows.',
  },
  {
    height: 956,
    label: 'tall-phone',
    represents:
      'Current large flagship phones such as the iPhone Pro Max and large Galaxy class.',
  },
  {
    height: 1080,
    label: 'desktop',
    represents:
      'Full-HD desktop users and tall browser windows where max-size constraints should stop unbounded growth.',
  },
];

/**
 * Every CSS breakpoint is tested on the last pixel before, the breakpoint
 * itself, and the first pixel after. Content-driven wrap thresholds around
 * 650px are included because headline wrapping can change without a media query.
 */
export const CRITICAL_WIDTHS = [
  320,
  519,
  520,
  521,
  649,
  650,
  651,
  899,
  900,
  901,
  1099,
  1100,
  1101,
  1919,
  1920,
];

export const VISUAL_VIEWPORTS = [
  {
    id: 'minimum-phone',
    width: 320,
    height: 568,
    represents: 'Supported minimum, legacy compact-phone, and narrow embedded-webview users.',
  },
  {
    id: 'android-phone',
    width: 360,
    height: 780,
    represents: 'High-volume compact and budget/mid-range Android users.',
  },
  {
    id: 'iphone-17',
    width: 402,
    height: 874,
    represents: 'Current standard-size iPhone 17 users.',
  },
  {
    id: 'large-android',
    width: 412,
    height: 915,
    represents: 'Large Android flagship users, including the Galaxy S25 Ultra class.',
  },
  {
    id: 'iphone-17-pro-max',
    width: 440,
    height: 956,
    represents: 'Large iPhone and accessibility-oriented large-screen users.',
  },
  {
    id: 'phone-landscape',
    width: 844,
    height: 390,
    represents: 'Phone users who rotate to landscape and users with very short browser windows.',
  },
  {
    id: 'intermediate',
    width: 600,
    height: 960,
    represents: 'Foldable, small-tablet, zoomed-browser, and narrow-window users between phone and tablet presets.',
  },
  {
    id: 'tablet-portrait',
    width: 768,
    height: 1024,
    represents: 'Mainstream portrait-tablet users.',
  },
  {
    id: 'single-column-edge',
    width: 900,
    height: 1000,
    represents: 'The final pixel of the single-column experience.',
  },
  {
    id: 'two-column-edge',
    width: 901,
    height: 1000,
    represents: 'The first pixel of the compact two-column experience.',
  },
  {
    id: 'laptop',
    width: 1366,
    height: 768,
    represents: 'Common Windows and Chromebook laptop users with limited vertical space.',
  },
  {
    id: 'desktop',
    width: 1440,
    height: 1000,
    represents: 'Modern desktop and large-laptop users.',
  },
  {
    id: 'wide-desktop',
    width: 1920,
    height: 1080,
    represents: 'Full-HD and wide-desktop users where maximum widths must remain intentional.',
  },
];

export const CROSS_BROWSER_VIEWPORTS = [
  VISUAL_VIEWPORTS.find(({ id }) => id === 'android-phone'),
  VISUAL_VIEWPORTS.find(({ id }) => id === 'tablet-portrait'),
  VISUAL_VIEWPORTS.find(({ id }) => id === 'desktop'),
];

export function sweepWidths() {
  const widths = new Set(CRITICAL_WIDTHS);

  for (const { from, to, step } of WIDTH_RANGES) {
    for (let width = from; width <= to; width += step) widths.add(width);
    widths.add(to);
  }

  return [...widths].sort((a, b) => a - b);
}
