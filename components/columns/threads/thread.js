import { useRef, useEffect } from "react";
import { createStore, useStore } from "zustand";
import Spinner from "../spinner";
import BaseButton from "@/components/buttons/base-button";
import { useModalStore } from "@/app/layout";
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
  }));

export default function Thread({ data }) {
  const storeRef = useRef(null);
  const openModal = useModalStore((state) => state.open);

  if (!storeRef.current) {
    storeRef.current = createThreadStore(data);
  }

  const listMessages = useStore(
    storeRef.current,
    (state) => state.listMessages,
  );

  const newMessage = useStore(storeRef.current, (state) => state.newMessage);

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
            openModal(<CreateMessageDialog createAction={newMessage} />);
          }}
        />
      </div>
    );
  }

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </>
  );
}
