import { nanoid } from 'nanoid';
import useStore from '../editor';
import { setModal } from './ui';
import { createMessages } from '@/service/message';

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

export const updateMessage = (id, content, state) => {
  useStore.setState((s) => {
    const index = s.messages.findIndex((m) => m.id === id);
    if (index === -1) {
      setModal({
        title: 'Message not found',
        confirm: { label: 'OK' },
      });
      return {};
    }
    content = content || s.messages[index].content;
    return {
      messages: [
        ...s.messages.slice(0, index),
        { ...s.messages[index], content, state },
        ...s.messages.slice(index + 1),
      ],
    };
  });
};

export const getMessageById = (id) => {
  return useStore.getState().messages.find((m) => m.id === id);
};

export const getMessagesAfterLastDivider = (messages) => {
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  // Start from the end and find the first divider
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'divider') {
      return messages.slice(i + 1);
    }
  }

  return [];
};

export async function addMessages(newMessages = [], reset = false) {
  const state = useStore.getState();
  const storySessionId = state.storySessionId;
  if (storySessionId) {
    try {
      useStore.setState({
        generating: true,
      });
      newMessages = await createMessages(storySessionId, newMessages, reset);
    } finally {
      useStore.setState({
        generating: false,
      });
    }
  }
  const messages = reset ? [] : state.messages;
  useStore.setState(() => {
    return { messages: [...messages, ...newMessages] };
  });
  return newMessages;
}

export async function resetMessages(messages) {
  await addMessages(messages, true);
}

export async function syncMessage(msgId) {
  let message = getMessageById(msgId);
  if (!message) return;
  const state = useStore.getState();
  const messages = state.messages;
  const storySessionId = state.storySessionId;
  if (storySessionId) {
    try {
      useStore.setState({
        generating: true,
      });
      const newMessages = await createMessages(storySessionId, [message]);
      messages.pop();
      useStore.setState(() => {
        return { messages: [...messages, ...newMessages] };
      });
      return newMessages[0];
    } finally {
      useStore.setState({
        generating: false,
      });
    }
  }
  return message;
}
