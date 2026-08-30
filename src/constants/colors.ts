/** Raw color palette — use `useAppTheme()` for theme-aware colors in components */
export const palette = {
  // Brand
  green: '#0CA201',
  yellow: '#FFCC00',
  mint: '#E9F9E8',

  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  grey50: '#F7F7F8',
  grey100: '#F6F6F6',
  grey200: '#F4F4F4',
  grey300: '#EAEAEA',
  grey400: '#E8E8E8',
  grey500: '#B0B0B0',
  grey600: '#9A9A9A',
  grey700: '#3A3A3A',
  grey800: '#2A2A2A',
  grey900: '#1E1E1E',

  // Semantic
  danger: '#F04B3E',
  favouritePink: '#FF4D8D',
  selectedGenderDark: '#1F4D1D',
} as const;

/**
 * @deprecated Use `palette` for raw values or `useAppTheme()` for themed colors.
 * Kept temporarily for backward compatibility in static contexts (e.g. banners).
 */
export const colors = {
  yellow: palette.yellow,
  green: palette.green,
  mint: palette.mint,
  black: palette.black,
  white: palette.white,
  lightGrey: palette.grey100,
  darkGrey: palette.grey900,
  screenLight: palette.grey50,
  textLight: '#222222',
  mutedLight: palette.grey600,
  mutedDark: palette.grey500,
  inputBgLight: palette.grey200,
  inputBgDark: palette.grey800,
  inputBorderLight: palette.grey400,
  inputBorderDark: palette.grey700,
  accent: palette.green,
  danger: palette.danger,
  selectedGenderLight: palette.mint,
  selectedGenderDark: palette.selectedGenderDark,
  favouriteActive: palette.favouritePink,
} as const;