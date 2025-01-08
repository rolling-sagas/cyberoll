import useStore from "../editor";

export const setFirstColumnWidth = (width) =>
  useStore.setState({ firstColumnWidth: width });

export const setAutoGenerate = (value) =>
  useStore.setState({ autoGenerate: value });

export const setPlayMode = (value) => useStore.setState({ playMode: value });

export const setScript = (value) => useStore.setState({ script: value });

export const setModal = (value) => useStore.setState({ modal: value });
