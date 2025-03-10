import useStore from "../editor";
import { upsertStoryScript } from "@/service/script";
import debounce from "lodash/debounce";

const debounceUpdateStory = debounce(async () => {
  const { storyId, script } = useStore.getState()
  await upsertStoryScript(storyId, script)
}, 1000)

export const setFirstColumnWidth = (width) =>
  useStore.setState({ firstColumnWidth: width });

export const setAutoGenerate = (value) =>
  useStore.setState({ autoGenerate: value });

export const setPlayMode = (value) => useStore.setState({ playMode: value });

export const setScript = (value) => {
  debounceUpdateStory()
  return useStore.setState({ script: value })
};

export const setModal = (value) => useStore.setState({ modal: value });
