import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

const useStore = create(
  persist(
    devtools(() => ({
      editingComponent: null,
      editingFunction: null,
      viewingMessage: null,
      modal: null,

      diceBox: null,
      rolling: 0,
      lastRoll: null,

      firstColumnWidth: "50%",
      autoGenerate: false,
      playMode: true,

      script: "",
      components: [],
      messages: [],
      functions: [],

      gameSession: {},
    })),
    {
      name: "game-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        firstColumnWidth: state.firstColumnWidth,
        autoGenerate: state.autoGenerate,
        gameSession: state.gameSession,
        hideSystem: state.hideSystem,
        script: state.script,
        components: state.components,
        functions: state.functions,
        messages: state.messages,
      }),
    },
  ),
);

export default useStore;
