"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import Column from "@/components/column/column";
import Threads from "./threads/threads";

export const usePinStore = create(
  persist(
    (set, get) => ({
      pinned: [],

      pin: (id, extra) => {
        if (get().pinned.find((n) => n.id === id)) return;

        return set((state) => {
          return { pinned: [...state.pinned, { id, extra }] };
        });
      },

      unpin: (id) => {
        // threads can't be unpinned
        if (id === "threads") return;

        return set((state) => {
          return { pinned: state.pinned.filter((n) => n.id !== id) };
        });
      },
    }),
    {
      name: "pinned", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);

export const useColumnsStore = create((set) => ({
  columns: [],

  reset: () => {
    return set((state) => {
      return { columns: [] }
    })
  },

  addColumn: (id, props, children) => {
    return set((state) => {
      if (state.columns.find((n) => n.id === id)) return state;
      return { columns: [...state.columns, { id, props, children }] };
    });
  },

  setColumn: (id, children) => {
    return set((state) => {
      if (!state.columns.find((n) => n.id === id)) {
        console.warn("Column not found");
        return state
      }

      return {
        columns: state.columns.map((n) =>
          n.id === id
            ? {
              id,
              props: {
                headerLeft: null,
                headerCenter: null,
                headerRight: null,
              },
              children,
            }
            : n,
        ),
      };
    });
  },

  setHeader: (id, headerLeft, headerCenter, headerRight) => {
    return set((state) => {
      if (!state.columns.find((n) => n.id === id))
        console.warn("Column not found");
      return {
        columns: state.columns.map((n) =>
          n.id === id
            ? {
              id,
              props: { ...n.props, headerLeft, headerCenter, headerRight },
              children: n.children,
            }
            : n,
        ),
      };
    });
  },

  rmColumn: (id) => {
    return set((state) => {
      if (!state.columns.find((n) => n.id === id))
        console.warn("Column not found");
      return { columns: state.columns.filter((n) => n.id !== id) };
    });
  },
}));

export default function PinnedColumns() {
  const pinned = usePinStore((state) => state.pinned);

  const columns = useColumnsStore((state) => state.columns);

  const addColumn = useColumnsStore((state) => state.addColumn);

  pinned.forEach((pin) => {
    switch (pin.id) {
      case "threads":
        addColumn("threads", { headerCenter: <div>Threads</div> }, <Threads />);
        break;
      default:
        break;
    }
  });

  return (
    <>
      {columns.map((col) => (
        <Column {...col.props} key={col.id}>
          {col.children}
        </Column>
      ))}
    </>
  );
}
