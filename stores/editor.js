import { devtools } from "zustand/middleware";
import { create } from "zustand";

const initialState = {
  story: null,
  storyId: '',
  storySessionId: '',
  editingComponent: null,
  viewingMessage: null,
  modal: null,
  isEditing: false,

  diceBox: null,
  rolling: 0,
  lastRoll: null,

  autoGenerate: false,
  playMode: true,

  script: "",
  components: [],
  messages: [],

  loading: false,
  generating: false,
}

const useStore = create(
  devtools((set) => ({
    ...initialState,
    reset: () => {
      set(initialState)
    },
  })),
);

export default useStore;
