import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, useColorScheme } from "react-native";

import { palette } from "@/src/constants/colors";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ThemeMode = "system" | "light" | "dark";

export interface ThemeColors {
  screen: string;
  card: string;
  text: string;
  button: string;
  muted: string;
  border: string;
  accent: string;
  inputBg: string;
  inputBorder: string;
  danger: string;
  cardContainer: string;
  imageContainer: string;
  activityIndicator: string;
  thumbnailBg: string;
  controlBg: string;
  controlBorder: string;
  genderSelectedBg: string;
  favouriteActive: string;
}

interface ThemeContextValue {
  /** Resolved color palette for the current theme */
  colors: ThemeColors;
  /** Whether the current resolved scheme is dark */
  isDark: boolean;
  /** Current persistence mode: system | light | dark */
  mode: ThemeMode;
  /** Persist and apply a new theme mode */
  setMode: (mode: ThemeMode) => void;
}

// ---------------------------------------------------------------------------
// Theme resolution
// ---------------------------------------------------------------------------

function resolveColors(isDark: boolean): ThemeColors {
  return {
    screen: isDark ? palette.black : palette.grey50,
    card: isDark ? palette.grey900 : palette.white,
    text: isDark ? palette.white : '#222222',
    button: isDark ? palette.black : palette.white,
    inputBorder: isDark ? palette.grey700 : palette.grey400,
    cardContainer: isDark ? palette.black : palette.white,
    imageContainer: isDark ? palette.grey900 : palette.grey100,
    muted: isDark ? palette.grey500 : palette.grey600,
    border: isDark ? palette.grey700 : palette.grey400,
    inputBg: isDark ? palette.grey800 : palette.grey200,
    accent: palette.green,
    danger: palette.danger,
    activityIndicator: palette.green,
    thumbnailBg: isDark ? palette.grey800 : palette.grey300,
    controlBg: isDark ? palette.black : palette.white,
    controlBorder: isDark ? palette.grey100 : palette.grey900,
    genderSelectedBg: isDark ? palette.selectedGenderDark : palette.mint,
    favouriteActive: palette.favouritePink,
  };
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const STORAGE_KEY = "@theme_mode";

const ThemeContext = createContext<ThemeContextValue>({
  colors: resolveColors(false),
  isDark: false,
  mode: "system",
  setMode: () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // Load persisted preference on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark" || stored === "system") {
          setThemeModeState(stored);
          applyColorScheme(stored);
        }
      } catch {
        // Ignore storage errors, keep system default
      }
    })();
  }, []);

  const setMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    applyColorScheme(mode);
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  }, []);

  const colors = useMemo(() => resolveColors(isDark), [isDark]);

  const value = useMemo<ThemeContextValue>(
    () => ({ colors, isDark, mode: themeMode, setMode }),
    [colors, isDark, themeMode, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Single hook for all theme needs: resolved colors, isDark flag, mode control */
export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/**
 * @deprecated Use `useAppTheme()` instead. Kept temporarily for migration.
 */
export function useThemeMode() {
  const { mode: themeMode, setMode: setThemeMode } = useContext(ThemeContext);
  return { themeMode, setThemeMode };
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/** Force RN Appearance so useColorScheme() returns the chosen scheme everywhere */
function applyColorScheme(mode: ThemeMode) {
  if (mode === "system") {
    Appearance.setColorScheme(null); // reset to system default
  } else {
    Appearance.setColorScheme(mode);
  }
}
