"use client";
import { useEffect } from "react";

import { create } from "zustand";

import { useModalStore } from "@/app/layout";
import Column from "@/components/column/column";

import Spinner from "../spinner";
import Button from "../button";
import Thread from "./thread";

import { BubbleChatAddIcon } from "@hugeicons/react";
import CreateSessionDialog from "./create-session-dialog";

const store = create((set) => ({
  threads: [],
  errors: [],

  loading: "pending",

  listThreads: async () => {
    const response = await fetch("/api/session");
    const threads = await response.json();
    set({ threads, loading: "loaded" });
  },

  newThread: async (name, description) => {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: { name: name, description: description } }),
    });
    const thread = await response.json();
    console.log(thread);
  },
}));

const CreateThread = function () {
  const openModal = useModalStore((state) => state.open);
  const newThread = store((state) => state.newThread);

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(<CreateSessionDialog createAction={newThread} />)
        }
      >
        <BubbleChatAddIcon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Start a thread
        </div>
        <Button label="Create" />
      </div>
    </div>
  );
};

export default function Threads() {
  const threads = store((state) => state.threads);
  const loading = store((state) => state.loading);
  const listThreads = store((state) => state.listThreads);
  const newThread = store((state) => state.newThread);

  const openModal = useModalStore((state) => state.open);

  useEffect(() => {
    listThreads();
  }, [listThreads]);

  if (loading === "pending") {
    return (
      <Column headerCenter={<div>Threads</div>}>
        <div className="flex w-full h-full items-center justify-center">
          <Spinner />
        </div>
      </Column>
    );
  }

  if (threads.length === 0) {
    return (
      <Column headerCenter={<div>Threads</div>}>
        <div className="flex flex-col w-full h-full items-center justify-center">
          <div className="text-rs-text-secondary text-[16px]">
            No thread here.
          </div>
          <Button
            label="Create"
            className="mt-2"
            onClick={() => {
              openModal(<CreateSessionDialog createAction={newThread} />);
            }}
          />
        </div>
      </Column>
    );
  }

  return (
    <Column headerCenter={<div>Threads</div>}>
      <>
        <CreateThread />
        {threads.map((thread) => (
          <Thread key={thread.id} thread={thread} />
        ))}
      </>
    </Column>
  );
}
