import toast from "react-hot-toast/headless";
import { useRef, useEffect } from "react";
import { createStore, useStore } from "zustand";
import Spinner from "../spinner";
import BaseButton from "@/components/buttons/base-button";
import { useModalStore } from "@/components/modal/dialog-placeholder";
import CreateMessageDialog from "./create-message-dialog";

const createThreadStore = (data) =>
  createStore((set) => ({
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,

    loading: "pending",

    messages: [],

    listMessages: async () => {
      const response = await fetch(`/api/session/${data.id}/message`);
      const messages = await response.json();
      set({ messages, loading: "loaded" });
      console.log("messages", data.id, messages);
    },

    newMessage: async (role, content) => {
      const response = await fetch(`/api/session/${data.id}/message`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ data: { role: role, content: content } }),
      });
      const message = await response.json();
      console.log(message);
    },

    updateMessage: async (mid, role, content) => {
      const response = await fetch(
        "/api/session/" + data.id + "/message/" + mid,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            data: { role: role, content: content },
          }),
        },
      );
      const message = await response.json();
      console.log(message);
    },

    deleteMessage: async (mid) => {
      const response = await fetch(
        "/api/session/" + data.id + "/message/" + mid,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      // const res = await response.json();
      console.log(response);
    },

    generate: async () => {
      const response = await fetch("/api/session/" + data.id + "/generate", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const res = await response.json();
      console.log(res);
    },

    regenerate: async (mid) => {
      const response = await fetch(
        "/api/session/" + data.id + "/message/" + mid + "/regenerate",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      const res = await response.json();
      console.log(res);
    },
  }));

import { useColumnsStore } from "../pinned-columns";
import Threads from "./threads";
import ColumnBackButton from "@/components/column/column-back-button";
import {
  AiChat02Icon,
  BubbleChatAddIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/react";
import MessageItem from "./message-item";
import { useAlertStore } from "@/components/modal/alert-placeholder";
import Alert from "@/components/modal/alert";

export default function Thread({ data, column }) {
  const storeRef = useRef(null);
  const openModal = useModalStore((state) => state.open);
  const openAlert = useAlertStore((state) => state.open);
  const setHeader = useColumnsStore((state) => state.setHeader);

  useEffect(() => {
    setHeader(
      column,
      <ColumnBackButton backId={column} backChildren=<Threads /> />,
      data.name,
      null,
    );
  });

  if (!storeRef.current) {
    storeRef.current = createThreadStore(data);
  }

  const listMessages = useStore(
    storeRef.current,
    (state) => state.listMessages,
  );

  const newMessage = useStore(storeRef.current, (state) => state.newMessage);

  const deleteMessage = useStore(
    storeRef.current,
    (state) => state.deleteMessage,
  );

  const updateMessage = useStore(
    storeRef.current,
    (state) => state.updateMessage,
  );

  const generate = useStore(storeRef.current, (state) => state.generate);
  const regenerate = useStore(storeRef.current, (state) => state.regenerate);

  const messages = useStore(storeRef.current, (state) => state.messages);
  const loading = useStore(storeRef.current, (state) => state.loading);

  useEffect(() => {
    if (listMessages) {
      listMessages();
    }
  }, [listMessages]);

  if (loading === "pending") {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No messages here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateMessageDialog
                onConfirm={async (role, content, autoGen) => {
                  const tid = toast.loading("Creating message...", {
                    icon: <Spinner />,
                  });
                  await newMessage(role, content);
                  console.log(role, content, autoGen);
                  if (autoGen) {
                    await generate();
                    toast.success("Message generated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } else {
                    await listMessages();
                    toast.success("Message created", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }
                }}
              />,
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col-reverse overflow-y-auto">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            isFirst={msg.id === messages[0].id}
            message={msg}
            onDeleteClick={() => {
              openAlert(
                <Alert
                  title="Delete message?"
                  message="If you delete this message, 
                you won't be able to restore it."
                  onConfirm={async () => {
                    const tid = toast.loading("Deleting message...", {
                      icon: <Spinner />,
                    });
                    await deleteMessage(msg.id);
                    await listMessages();
                    toast.success("Message deleted", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }}
                />,
              );
            }}
            onUpdateClick={() => {
              openModal(
                <CreateMessageDialog
                  role={msg.role}
                  content={msg.content}
                  onConfirm={async (role, content) => {
                    const tid = toast.loading("Updating message...", {
                      icon: <Spinner />,
                    });
                    console.log(role, content);
                    await updateMessage(msg.id, role, content);
                    await listMessages();
                    toast.success("Message updated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }}
                />,
              );
            }}
            onGenerateClick={async () => {
              const tid = toast.loading("Regenerating message...", {
                icon: <Spinner />,
              });
              await regenerate(msg.id);
              await listMessages();
              toast.success("Message regenerated", {
                id: tid,
                icon: <CheckmarkCircle01Icon />,
              });
            }}
          />
        ))}
      </div>

      <div className="w-full px-6 border-b">
        <div
          className="flex flex-row py-4 items-center"
          onClick={() =>
            openModal(
              <CreateMessageDialog
                onConfirm={async (role, content, autoGen) => {
                  const tid = toast.loading("Creating message...", {
                    icon: <Spinner />,
                  });
                  await newMessage(role, content);
                  console.log(role, content, autoGen);
                  if (autoGen) {
                    await generate();
                    toast.success("Generating message...", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                    await listMessages();
                    toast.success("Message generated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } else {
                    await listMessages();
                    toast.success("Message created", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }
                }}
              />,
            )
          }
        >
          <BubbleChatAddIcon
            className="text-rs-text-secondary"
            strokeWidth={1}
          />
          <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
            Create a new message
          </div>
          <BaseButton
            label={<AiChat02Icon />}
            onClick={async (evt) => {
              evt.stopPropagation();
              const tid = toast.loading("Generating...", {
                icon: <Spinner />,
              });
              await generate();
              await listMessages();
              toast.success("Message generated", {
                id: tid,
                icon: <CheckmarkCircle01Icon />,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
