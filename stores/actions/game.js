import parseString from "@iarna/toml/parse-string";

import QuickJSManager from "@/utils/quickjs";
import useStore from "../editor";
import { setModal } from "./ui";
import {
  addMessage,
  getMessageById,
  updateMessage,
  getMessagesAfterLastDivider,
} from "./message";

const quickjs = new QuickJSManager();

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
      title: "Error, when parsing components",
      description: e.message,
      confirm: { label: "Dismiss" },
    });
    return;
  }

  if (useStore.getState().rolling > 0) {
    await clearRoll();
  }

  // set components
  try {
    // initial quickjs
    const functions = useStore.getState().functions;

    await quickjs.initialize(functions);
    await quickjs.executeScript(useStore.getState().script, components);

    if (refresh) {
      const messages = await quickjs.callFunction("onStart");
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
      title: "Error, when interpreting script",
      description: e.message,
      confirm: { label: "Dismiss" },
    });
  }
};

export const restart = () => {
  setModal({
    title: "Are you sure to restart the game?",
    description: "It will clear all messages, and you can't restore them.",
    confirm: { label: "OK", action: executeScript },
    cancel: { label: "Cancel" },
  });
};

// generate message from llm
const GENERATE_URL = "https://dev-api.rollingsagas.com/seecreet/ai";
export const generate = async () => {
  let messages = useStore.getState().messages;
  messages = getMessagesAfterLastDivider(messages);

  messages = messages.map((m) => {
    let { role, content } = m;
    if (typeof content === "object") {
      content = JSON.stringify(content);
    }
    return { role, content };
  });

  let message = addMessage("assistant", "Generating...");
  try {
    const response = await fetch(GENERATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages, type: "json" }),
    });

    let resText = "";
    for await (const chunk of response.body) {
      resText += new TextDecoder("utf8").decode(chunk);
      updateMessage(message.id, "Generating... " + resText);
    }

    const jsonContent = JSON.parse(resText);
    updateMessage(message.id, jsonContent);

    // send generated message into scripting
    const newMessage = getMessageById(message.id);
    await quickjs.callFunction("onAssistant", {
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
  try {
    let result = await quickjs.callFunction("onAction", action);

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
        case "next":
          const messages = await quickjs.callFunction("onStart");
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
      title: "onUserAction Error:",
      description: e.message,
      confirm: { label: "Dismiss" },
    });
  }
};

export const saveGameSession = async () => {
  try {
    const gameSession = await quickjs.callFunction("onSave");
    useStore.setState((state) => ({
      gameSession: { ...gameSession },
    }));
  } catch (e) {
    setModal({
      title: "onSave Error:",
      description: e.message,
      confirm: { label: "Dismiss" },
    });
  }
};

export const loadGameSession = async () => {
  try {
    await quickjs.callFunction("onLoad", useStore.getState().gameSession);
  } catch (e) {
    setModal({
      title: "onLoad Error:",
      description: e.message,
      confirm: { label: "Dismiss" },
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
            useStore.setState(() => ({
              components: [...result.components],
              script: result.script,
              functions: [...result.functions],
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
    functions: useStore.getState().functions,
  };

  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));

  var dlAnchorElem = document.getElementById("downloadAnchorElem");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "rs_template.json");
  console.log(dlAnchorElem);
  dlAnchorElem.click();
};
