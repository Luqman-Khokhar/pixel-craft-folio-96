import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  updateColor: (key: keyof ThemeColors, value: string) => void;
  toggleDarkMode: () => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultLightColors: ThemeColors = {
  primary: "217 91% 60%",
  secondary: "210 40% 96%",
  accent: "262 83% 58%",
  background: "0 0% 100%",
  foreground: "222 47% 11%",
};

const defaultDarkColors: ThemeColors = {
  primary: "217 91% 60%",
  secondary: "217 33% 15%",
  accent: "262 83% 58%",
  background: "222 47% 5%",
  foreground: "210 40% 98%",
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved ? saved === "dark" : true;
  });

  const [colors, setColors] = useState<ThemeColors>(() => {
    const savedColors = localStorage.getItem("theme-colors");
    if (savedColors) {
      return JSON.parse(savedColors);
    }
    return isDark ? defaultDarkColors : defaultLightColors;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme-mode", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    
    localStorage.setItem("theme-colors", JSON.stringify(colors));
  }, [colors]);

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
    const newMode = !isDark;
    setColors(newMode ? defaultDarkColors : defaultLightColors);
  };

  const resetTheme = () => {
    setColors(isDark ? defaultDarkColors : defaultLightColors);
  };

  return (
    <ThemeContext.Provider value={{ colors, isDark, updateColor, toggleDarkMode, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
