import { devtools } from "zustand/middleware";
import { create } from "zustand";

const initialState = {
  publicStories: [],
  publicLoading: false,
  stories: [],
  loading: false,
}

const useStoryStore = create(
  devtools((set) => ({
    ...initialState,
    reset: () => {
      set(initialState)
    },
  })),
);

export default useStoryStore;
