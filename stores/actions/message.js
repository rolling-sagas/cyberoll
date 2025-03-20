import { nanoid } from 'nanoid';
import useStore from '../editor';
import { setModal } from './ui';
import { createMessages } from '@/service/message';
import { MESSAGE_STATUS } from '@/utils/const';

export const startViewingMessage = (message) =>
  useStore.setState(() => ({ viewingMessage: message }));

export const delMessage = (id) =>
  useStore.setState((state) => ({
    messages: state.messages.filter((m) => m.id !== id),
  }));

export const createMessage = (role, content, status = MESSAGE_STATUS.generating) => {
  const message = {
    id: nanoid(),
    role,
    content,
    status: MESSAGE_STATUS.generating,
  };
  return message
}

export const addMessage = (role, content) => {
  const message = createMessage(role, content);
  useStore.setState((state) => ({
    messages: [...state.messages, message],
  }));
  return message;
};

export const updateMessage = (id, msg = {}) => {
  useStore.setState((s) => {
    const index = s.messages.findIndex((m) => m.id === id);
    if (index === -1) {
      setModal({
        title: 'Message not found',
        confirm: { label: 'OK' },
      });
      return {};
    }
    return {
      messages: [
        ...s.messages.slice(0, index),
        { ...s.messages[index], ...msg },
        ...s.messages.slice(index + 1),
      ],
    };
  });
};

export const getLastMessageState = (messages = []) => {
  const msg = messages.findLast((m) => m.state);
  return msg?.state;
};

export const sliceMessagesTillMid = (messages = [], mid, exclude = false) => {
  if (!mid) return [];
  let res = [];
  const index = messages.findIndex((m) => m.id === mid);
  if (index > -1) {
    res = messages.slice(0, index + (exclude ? 0 : 1));
  }
  return res;
};

export const getLastMessageStateFromMid = (mid, exclude = false) => {
  const messages = useStore.getState().messages
  return getLastMessageState(sliceMessagesTillMid(messages, mid, exclude))
}

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

export async function addMessages(newMessages = [], reset = false, localMessages = []) {
  const state = useStore.getState();
  const storySessionId = state.storySessionId;
  const messages = reset ? [] : state.messages;
  useStore.setState(() => {
    return { messages: [...messages, ...newMessages, ...localMessages] };
  });

  if (storySessionId) {
    const preMessages = newMessages
    newMessages = await createMessages(storySessionId, newMessages, reset);
    preMessages.forEach((m, i) => {
      updateMessage(m.id, newMessages[i])
    })
  }
  return newMessages;
}

export async function resetMessages(messages) {
  useStore.setState(() => {
    return { messages: [] };
  });
  await addMessages(messages, true);
}

export async function syncMessage(mid) {
  let message = getMessageById(mid);
  if (!message) return;
  const storySessionId = useStore.getState().storySessionId;
  if (storySessionId) {
    const [newMsg] = await createMessages(storySessionId, [message]);
    updateMessage(mid, {...newMsg, status: ''})
    return newMsg;
  } else {
    const newMsg = {
      ...message,
      status: '',
    }
    updateMessage(mid, newMsg)
    return newMsg;
  }
}
