import parseString from '@iarna/toml/parse-string';

import QuickJSManager from '@/utils/quickjs';
import useStore from '../editor';
import { setModal } from './ui';
import {
  addMessage,
  updateMessage,
  getMessagesAfterLastDivider,
  resetMessages,
  syncMessage,
  addMessages,
} from './message';
import { updateStory } from '@/service/story';
import { COMPONENT_TYPE } from '@/utils/const';
import { componentsToMap } from '@/utils/utils';
import { updateSession } from '@/service/session';

const quickjs = new QuickJSManager();

export const executeScript = async (refresh = true) => {
  let components = null;

  try {
    components = componentsToMap(useStore.getState().components, true)
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
    const functions = useStore.getState().components?.filter(comp => comp.type === COMPONENT_TYPE.Function) || [];

    await quickjs.initialize(functions);
    await quickjs.executeScript(useStore.getState().script, components);

    if (refresh) {
      const messages = await quickjs.callFunction('onStart');
      await resetMessages(messages)

      if (useStore.getState().autoGenerate) {
        await generate();
      }
    } else {
      // load game session
      await loadGameSession();
    }
  } catch (e) {
    console.error('[executeScript error]', e)
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

    const reader = response.body.getReader()
    const decoder = new TextDecoder("utf-8");
    let resText = '';
    while (true) {
      const { value, done } = await reader.read();
  
      if (done) break;
  
      resText += decoder.decode(value, { stream: true });
      updateMessage(message.id, 'Generating... ' + resText);
    }

    const jsonContent = JSON.parse(resText);
    updateMessage(message.id, jsonContent);

    // send generated message into scripting
    const newMessage = await syncMessage(message.id)

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

// user iteractive actions
export const onUserAction = async (action) => {
  console.log('[onUserAction result]')
  try {
    let result = await quickjs.callFunction('onAction', action);
    console.log('[onUserAction result]', result)
    // add messages
    if (result.messages) {
      await addMessages(result.messages)
      if (useStore.getState().autoGenerate) {
        await generate();
      }
    }

    // handle callback action
    if (result.action) {
      switch (result.action) {
        case 'next':
          const messages = await quickjs.callFunction('onStart');
          await addMessages(messages)

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

    const state = useStore.getState()
    const storySessionId = state.storySessionId
    if (storySessionId) {
      await updateSession(storySessionId, {
        state: gameSession,
      })
    }
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

export const importTemplate = (template) => {
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
            const story = await updateStory(useStore.getState().storyId, {
              script: {
                value: result.script || '',
              },
              components: [...result.components],
            })
            useStore.setState(() => ({
              components: story.components,
              script: story.script.value,
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
  dlAnchorElem = null;
};
