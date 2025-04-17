import QuickJSManager from '@/utils/quickjs';
import useStore from '../editor';
import { setModal } from './ui';
import {
  addMessage,
  createMessage,
  updateMessage,
  getMessagesAfterLastDivider,
  resetMessages,
  syncMessage,
  addMessages,
  getMessageById,
  getLastMessageState,
  sliceMessagesTillMid,
} from './message';
import { updateStory } from '@/service/story';
import { COMPONENT_TYPE } from '@/utils/const';
import { componentsToMap } from '@/utils/utils';
import { AI_BASE_URL } from '@/utils/const';
import { resetSession } from '@/service/session';
import { MESSAGE_STATUS } from '@/utils/const';
import { parse } from 'best-effort-json-parser';
import { azure } from '@/service/ai';
import { registerWithConfig, renderTemplate } from '@/utils/handlebars';

const quickjs = new QuickJSManager();

export const executeScript = async (refresh = true) => {
  console.log(2222, 'executeScript')
  let components = null;

  try {
    components = componentsToMap(useStore.getState().components, true);
  } catch (e) {
    setModal({
      title: 'Error, when parsing components',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
    return;
  }

  registerWithConfig(components);

  if (useStore.getState().rolling > 0) {
    await clearRoll();
  }

  // set components
  try {
    // initial quickjs
    const functions =
      useStore
        .getState()
        .components?.filter((comp) => comp.type === COMPONENT_TYPE.Function) ||
      [];

    await quickjs.initialize(functions);
    await quickjs.executeScript(useStore.getState().script, components);

    if (refresh) {
      const messages = await quickjs.callFunction('onStart');
      console.log('onStart messages', messages);
      await resetMessages(messages);
      if (messages?.length) await generate();
    } else {
      // load game session
      await loadGameSession();
    }
  } catch (e) {
    console.error('[executeScript error]', e);
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

export const generate = async (skipCache = false, defaultMsg) => {
  useStore.setState({
    generating: true,
  });
  let message = defaultMsg || addMessage('assistant', 'Generating...');
  try {
    // const aiPath = localStorage.AI_PATH || 'ai';
    // const model = aiPath === 'ali' ? localStorage.AI_MODEL : undefined;
    // const GENERATE_URL = AI_BASE_URL + aiPath;

    let messages = useStore.getState().messages;
    messages = getMessagesAfterLastDivider(messages);

    messages = messages.map((m) => {
      let { role, content } = m;
      if (typeof content === 'object') {
        content = JSON.stringify(content);
      }
      return { role, content };
    });

    // const body = { messages: messages, type: 'json', skip_cache: skipCache };
    // if (model) body.model = model;
    // const response = await fetch(GENERATE_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(body),
    // });
    const response = await azure(messages, skipCache);

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let resText = '';
    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      resText += decoder.decode(value, { stream: true });
      updateMessage(message.id, { content: parse(resText) });
    }

    let finalContent = resText;
    try {
      // 这里用 JSON.parse 让非正常json报错，展示报错ui
      finalContent = JSON.parse(resText);
      console.log('[ai parsed json]:', finalContent);
      if (finalContent.error) {
        console.error('[ai error]:', finalContent.error);
        return updateMessage(message.id, {
          content:
            finalContent.code !== 1001 ? finalContent.error : 'Generate error!',
          status:
            finalContent.code !== 1001
              ? MESSAGE_STATUS.error
              : MESSAGE_STATUS.outOfCredits,
        });
      }
      updateMessage(message.id, {
        content: finalContent,
        status: MESSAGE_STATUS.finished,
      });
    } catch (e) {
      console.error('[ai parse json error]:', e);
      return updateMessage(message.id, {
        status: MESSAGE_STATUS.error,
      });
    }

    const msg = await quickjs.callFunction('onAssistant', {
      role: message.role,
      content: JSON.stringify(finalContent),
    });

    if (msg?.state) {
      updateMessage(message.id, msg);
    }

    // send generated message into scripting
    await syncMessage(message.id);
  } catch (error) {
    console.error(error);
    updateMessage(message.id, { status: MESSAGE_STATUS.error });
  } finally {
    useStore.setState({
      generating: false,
    });
  }
};

// user iteractive actions
export const onUserAction = async (action) => {
  useStore.setState({
    doingUserAction: true,
  });
  console.log('[onUserAction]');
  try {
    let result = await quickjs.callFunction('onAction', action);
    console.log('[onUserAction result]', result);
    // add messages
    if (result.messages) {
      const msg = createMessage('assistant', 'Generating...');
      const res = addMessages(result.messages, false, [msg]);
      if (!result.action) {
        await generate(false, msg);
      }
      await res;
    }

    // handle callback action
    if (result.action) {
      switch (result.action) {
        case 'next':
          const messages = await quickjs.callFunction('onStart');
          const msg = createMessage('assistant', 'Generating...');
          const res = addMessages(messages, false, [msg]);

          await generate(false, msg);
          await res;
          break;
      }
    }
  } catch (e) {
    setModal({
      title: 'onUserAction Error:',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
  } finally {
    useStore.setState({
      doingUserAction: false,
    });
  }
};

export const loadGameSession = async () => {
  try {
    const messages = useStore.getState().messages;
    const state = getLastMessageState(messages);
    console.log('loadGameSession', state);
    await quickjs.callFunction('onLoad', state);
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
            });
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

export const isLastMessageHasTailAction = (messages = []) => {
  const lastMessage = messages[messages.length - 1];
  const lastViews = lastMessage?.content?.views;
  const lastView = lastViews?.[lastViews?.length - 1];
  const lastViewType = lastView?.type;
  if (lastViewType === 'btn') return true;
  if (lastViewType?.startsWith('input.')) return true;
  return false;
};

export const restartFromMessage = async (mid, exclude = false) => {
  const generating = useStore.getState().generating;
  if (generating) return;
  useStore.setState({
    generating: true,
  });
  try {
    const messages = useStore.getState().messages || [];
    const message = getMessageById(mid);
    const isLocalMessage = !!message.status;
    const newMessages = sliceMessagesTillMid(messages, mid, exclude);
    useStore.setState({
      messages: newMessages,
    });

    const storySessionId = useStore.getState().storySessionId;
    if (storySessionId && !isLocalMessage) {
      await resetSession(storySessionId, mid, exclude);
    }
    await loadGameSession();
    if (
      !isLastMessageHasTailAction(newMessages)
    ) {
      await generate(exclude);
    }
  } catch (e) {
    setModal({
      title: 'Restart Error:',
      description: e.message,
      confirm: { label: 'Dismiss' },
    });
  } finally {
    useStore.setState({
      generating: false,
    });
  }
};
