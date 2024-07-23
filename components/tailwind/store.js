import { create } from "zustand";
import { persist } from "zustand/middleware";

function validateRGB(rgb) {
  if (!rgb) return true;
  const rgbRegex = /^(\d{1,3})\s*(\d{1,3})\s*(\d{1,3})$/;
  return rgbRegex.test(rgb);
}

export function applyTheme(themeColors) {
  const root = document.documentElement;

  Object.keys(themeColors).forEach((key) => {
    const val = themeColors[key];
    const validation = validateRGB(val);
    if (!validation) {
      throw new Error(`Invalid RGB value for ${key}: ${val}`);
    }

    root.style.setProperty(key, val);
  });
}

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme: theme }),
    }),
    {
      name: "theme", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
