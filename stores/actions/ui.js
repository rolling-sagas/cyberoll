import useStore from "../editor";
import { upsertStoryScript } from "@/service/script";
import toast from "react-hot-toast/headless";

export const setFirstColumnWidth = (width) =>
  useStore.setState({ firstColumnWidth: width });

export const setAutoGenerate = (value) =>
  useStore.setState({ autoGenerate: value });

export const setPlayMode = (value) => useStore.setState({ playMode: value });

export const setScript = async (value) => {
  const { storyId } = useStore.getState()
  await upsertStoryScript(storyId, value);
  toast.success('Saved');
  return useStore.setState({ script: value })
};

export const setModal = (value) => useStore.setState({ modal: value });
