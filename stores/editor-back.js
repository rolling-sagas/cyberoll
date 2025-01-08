import { devtools } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import QuickJSManager from '../utils/quickjs';
import parseString from '@iarna/toml/parse-string';
import { nanoid } from 'nanoid';

import DiceBox from '@3d-dice/dice-box';

const quickjs = new QuickJSManager();

const useStore = create(
  persist(
    devtools(() => ({
      editingComponent: null,
      viewingMessage: null,
      modal: null,

      diceBox: null,
      rolling: 0,
      lastRoll: null,

      autoGenerate: false,
      playMode: true,

      script: '',
      components: [],
      messages: [],
      gameSession: {},
    })),
    {
      name: 'game-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        autoGenerate: state.autoGenerate,
        gameSession: state.gameSession,
        hideSystem: state.hideSystem,
        script: state.script,
        components: state.components,
        messages: state.messages,
      }),
    }
  )
);

export default useStore;

export const setAutoGenerate = (value) =>
  useStore.setState({ autoGenerate: value });

export const setPlayMode = (value) => useStore.setState({ playMode: value });

export const setScript = (value) => useStore.setState({ script: value });

export const executeScript = async (refresh = true) => {
  let components = null;
  try {
    components = useStore.getState().components.reduce((acc, item) => {
      try {
        acc[item.name] = parseString(item.value);
      } catch (e) {
        throw new Error(`Component "${item.name}" syntax error: ${e.message}`);
      }
      return acc;
    }, {});
  } catch (e) {
    setModal({
      title: 'Error, when parsing components',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
    return;
  }

  if (useStore.getState().rolling > 0) {
    await clearRoll();
  }

  // set components
  try {
    // initial quickjs
    await quickjs.initialize();
    await quickjs.executeScript(useStore.getState().script, components);

    if (refresh) {
      // start a new game
      // get initial messages
      const messages = await quickjs.callFunction('onStart');
      useStore.setState(() => {
        return { messages };
      });

      if (useStore.getState().autoGenerate) {
        await generate();
      }
    } else {
      // load game session
      await loadGameSession();
    }
  } catch (e) {
    setModal({
      title: 'Error, when interpreting script',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
  }
};

export const restart = () => {
  setModal({
    title: 'Are you sure to restart the game?',
    description: "It will clear all messages, and you can't restore them.",
    confirm: { label: 'OK', action: executeScript },
    cancel: { label: 'Cancel' },
  });
};

// Component actions
export const updateComponent = () =>
  useStore.setState((state) => {
    try {
      const compIndex = state.components.findIndex(
        (c) => c.name === state.editingComponent.name
      );
      if (compIndex === -1) {
        // add new component
        return {
          components: [...state.components, state.editingComponent],
        };
      }
      return {
        components: [
          ...state.components.slice(0, compIndex),
          state.editingComponent,
          ...state.components.slice(compIndex + 1),
        ],
      };
    } catch (e) {
      setModal({
        title: 'Error',
        description: e.message,
        confirm: { label: 'OK' },
      });

      return {};
    }
  });

export const delComponent = (name) =>
  useStore.setState((state) => {
    return {
      components: state.components.filter((c) => c.name !== name),
    };
  });

export const startEditingComponent = (name) => {
  useStore.setState((state) => {
    let component = state.components.find((c) => c.name === name);

    if (!component) {
      component = { name: 'new_component', value: `value = "Hello, world!"` };
    }
    return {
      editingComponent: component,
    };
  });
};

export const startViewingMessage = (message) =>
  useStore.setState(() => ({ viewingMessage: message }));

export const setEditingComponent = (comp) => {
  if (comp) {
    useStore.setState(() => ({
      editingComponent: { name: comp.name, value: comp.value },
    }));
  } else {
    useStore.setState(() => ({
      editingComponent: null,
    }));
  }
};

export const delMessage = (id) =>
  useStore.setState((state) => {
    return {
      messages: state.messages.filter((m) => m.id !== id),
    };
  });

export const setModal = (value) => useStore.setState({ modal: value });

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
        title: 'Message not found',
        confirm: { label: 'OK' },
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
  return useStore.getState().messages.find((m) => m.id === id);
};

// generate message from llm
const GENERATE_URL = 'https://dev-api.rollingsagas.com/seecreet/ai';
export const generate = async () => {
  let messages = useStore.getState().messages;
  messages = getMessagesAfterLastDivider(messages);

  messages = messages.map((m) => {
    let { role, content } = m;
    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }
    return { role, content };
  });

  let message = addMessage('assistant', 'Generating...');
  try {
    const response = await fetch(GENERATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages, type: 'json' }),
    });

    let resText = '';
    for await (const chunk of response.body) {
      resText += new TextDecoder('utf8').decode(chunk);
      updateMessage(message.id, 'Generating... ' + resText);
    }

    const jsonContent = JSON.parse(resText);
    updateMessage(message.id, jsonContent);

    // send generated message into scripting
    const newMessage = getMessageById(message.id);
    await quickjs.callFunction('onAssistant', {
      id: newMessage.id,
      role: newMessage.role,
      content: JSON.stringify(newMessage.content),
    });

    await saveGameSession();
  } catch (error) {
    console.error(error);
  }
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

// user iteractive actions
export const onUserAction = async (action) => {
  console.log('[onUserAction]', action);
  try {
    let result = await quickjs.callFunction('onAction', action);

    // add messages
    if (result.messages) {
      useStore.setState((state) => ({
        messages: [...state.messages, ...result.messages],
      }));

      if (useStore.getState().autoGenerate) {
        await generate();
      }
    }

    // handle callback action
    if (result.action) {
      switch (result.action) {
        case 'next':
          const messages = await quickjs.callFunction('onStart');
          useStore.setState((state) => {
            return { messages: [...state.messages, ...messages] };
          });

          if (useStore.getState().autoGenerate) {
            await generate();
          }
          break;
      }
    }
  } catch (e) {
    setModal({
      title: 'onUserAction Error:',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
  }
};

export const saveGameSession = async () => {
  try {
    const gameSession = await quickjs.callFunction('onSave');
    useStore.setState((state) => ({
      gameSession: { ...gameSession },
    }));
  } catch (e) {
    setModal({
      title: 'onSave Error:',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
  }
};

export const loadGameSession = async () => {
  try {
    await quickjs.callFunction('onLoad', useStore.getState().gameSession);
  } catch (e) {
    setModal({
      title: 'onLoad Error:',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
  }
};

export const importTemplate = () => {
  let el = document.createElement('input');
  el.setAttribute('type', 'file');
  el.setAttribute('accept', '.json');
  el.addEventListener('change', (evt) => {
    var files = evt.target.files;
    if (files.length <= 0) {
      return;
    }
    var fr = new FileReader();
    fr.onload = function (e) {
      var result = JSON.parse(e.target.result);
      setModal({
        title: 'Are you sure to import this template?',
        description: 'It will clear current scripts and components.',
        confirm: {
          label: 'Yes',
          action: async () => {
            useStore.setState(() => ({
              components: [...result.components],
              script: result.script,
            }));

            await executeScript();
          },
        },
        cancel: { label: 'No' },
      });
      el = null;
    };
    fr.readAsText(files.item(0));
  });
  el.click();
};

export const exportTemplate = () => {
  const exportObj = {
    script: useStore.getState().script,
    components: useStore.getState().components,
  };

  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj));

  var dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute('href', dataStr);
  dlAnchorElem.setAttribute('download', 'rs_template.json');
  dlAnchorElem.click();
};

let diceBox = null;

export const setDiceBox = async (container) => {
  const dice = new DiceBox({
    container: `#${container.id}`,
    assetPath: 'assets/',
    origin: 'https://cdn.jsdelivr.net/npm/@3d-dice/dice-box@1.1.4/dist/',
    onRollComplete: (res) => {
      useStore.setState((state) => ({
        rolling: 2,
        lastRoll: { ...state.lastRoll, value: res[0].value },
      }));
    },
  });

  diceBox = dice;
  await diceBox.init();
};

export const rollDice = (rollObj) => {
  diceBox.roll(rollObj?.notation || '1d100');
  useStore.setState(() => ({
    rolling: 1,
    lastRoll: { ...rollObj },
  }));
};

export const clearRoll = async () => {
  await diceBox.clear();
  useStore.setState(() => ({
    rolling: 0,
    lastRoll: null,
  }));
};
