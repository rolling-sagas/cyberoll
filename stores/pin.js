import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePinStore = create(
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
