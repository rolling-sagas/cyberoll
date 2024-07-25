import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePinStore = create(
  persist(
    (set, get) => ({
      pinned: [],

      pin: (name) => {
        if (get().pinned.includes(name)) return;
        return set((state) => {
          return { pinned: [...state.pinned, name] };
        });
      },

      unpin: (name) => {
        return set((state) => {
          return { pinned: state.pinned.filter((n) => n !== name) };
        });
      },
    }),
    {
      name: "pinned", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
