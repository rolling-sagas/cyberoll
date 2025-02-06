import { nanoid } from "nanoid";
import useStore from "../editor";
import { setModal } from "./ui";

export const startViewingMessage = (message) =>
  useStore.setState(() => ({ viewingMessage: message }));

export const delMessage = (id) =>
  useStore.setState((state) => ({
    messages: state.messages.filter((m) => m.id !== id),
  }));

export const addMessage = (role, content) => {
  const message = { id: nanoid(), role, content };
  useStore.setState((state) => ({
    messages: [...state.messages, message],
  }));
  return message;
};

export const updateMessage = (id, content) => {
  useStore.setState((state) => {
    const index = state.messages.findIndex((m) => m.id === id);
    if (index === -1) {
      setModal({
        title: "Message not found",
        confirm: { label: "OK" },
      });
      return {};
    }
    return {
      messages: [
        ...state.messages.slice(0, index),
        { ...state.messages[index], content },
        ...state.messages.slice(index + 1),
      ],
    };
  });
};

export const getMessageById = (id) => {
  console.log(3334, useStore.getState().messages, id)
  return useStore.getState().messages.find((m) => m.id === id);
};

export const getMessagesAfterLastDivider = (messages) => {
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  // Start from the end and find the first divider
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "divider") {
      return messages.slice(i + 1);
    }
  }

  return [];
};
