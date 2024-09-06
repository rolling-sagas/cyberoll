"use client";
import toast from "react-hot-toast/headless";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { create } from "zustand";

import { useModalStore } from "@/components/modal/dialog-placeholder";
import { useAlertStore } from "@/components/modal/alert-placeholder";
import Alert from "@/components/modal/alert";

import Spinner from "../spinner";
import BaseButton from "@/components/buttons/base-button";
import ThreadItem from "./thread-item";

import { BubbleChatAddIcon, CheckmarkCircle01Icon } from "@hugeicons/react";
import CreateSessionDialog from "./create-session-dialog";

const useThreadsStore = create((set) => ({
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

  updateThread: async (id, name, description) => {
    const response = await fetch("/api/session/" + id, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: { name: name, description: description } }),
    });
    const thread = await response.json();
    console.log(thread);
  },

  copyThread: async (id, name, description) => {
    const response = await fetch("/api/session/" + id + "/copy", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: { name: name, description: description } }),
    });
    const thread = await response.json();
    console.log(thread);
  },

  deleteThread: async (id) => {
    const response = await fetch("/api/session/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    const res = await response.json();
    console.log(res);
  },
}));

const CreateThread = function() {
  const openModal = useModalStore((state) => state.open);
  const newThread = useThreadsStore((state) => state.newThread);
  const listThreads = useThreadsStore((state) => state.listThreads);

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(
            <CreateSessionDialog
              onConfirm={async (name, desc) => {
                const tid = toast.loading("Creating thread...", {
                  icon: <Spinner />,
                });
                await newThread(name, desc);
                await listThreads();
                toast.success("Thread created", {
                  id: tid,
                  icon: <CheckmarkCircle01Icon />,
                });
              }}
            />,
          )
        }
      >
        <BubbleChatAddIcon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Start a thread
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
};

export default function Threads() {
  const router = useRouter()

  const loading = useThreadsStore((state) => state.loading);

  const listThreads = useThreadsStore((state) => state.listThreads);
  const newThread = useThreadsStore((state) => state.newThread);
  const copyThread = useThreadsStore((state) => state.copyThread);
  const updateThread = useThreadsStore((state) => state.updateThread);
  const deleteThread = useThreadsStore((state) => state.deleteThread);

  const threads = useThreadsStore((state) => state.threads);

  const openModal = useModalStore((state) => state.open);
  const openAlert = useAlertStore((state) => state.open);

  useEffect(() => {
    listThreads();
  }, [listThreads]);

  const onEnterThread = (thread) => {
    router.push("/th/" + thread.id)
  };

  if (loading === "pending") {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No thread here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateSessionDialog
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Creating thread...", {
                    icon: <Spinner />,
                  });
                  await newThread(name, desc);
                  await listThreads();
                  toast.success("Thread created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                }}
              />,
            );
          }}
        />
      </div>
    );
  }

  return (
    <>
      <CreateThread />
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          onEnterThread={onEnterThread}
          onUpdateClick={() => {
            openModal(
              <CreateSessionDialog
                name={thread.name}
                desc={thread.description}
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Updating thread...", {
                    icon: <Spinner />,
                  });
                  await updateThread(thread.id, name, desc);
                  await listThreads();
                  toast.success("Thread updated", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                }}
              />,
            );
          }}
          onDuplicateClick={() => {
            openModal(
              <CreateSessionDialog
                name={thread.name + " copy"}
                desc={thread.description}
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Duplicating thread...", {
                    icon: <Spinner />,
                  });
                  await copyThread(thread.id, name, desc);
                  await listThreads();
                  toast.success("Thread duplicated", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                }}
              />,
            );
          }}
          onDeleteClick={async () => {
            openAlert(
              <Alert
                title="Delete thread?"
                message="If you delete this thread, 
                you won't be able to restore it."
                onConfirm={async () => {
                  const tid = toast.loading("Deleting thread...", {
                    icon: <Spinner />,
                  });
                  await deleteThread(thread.id);
                  await listThreads();
                  toast.success("Thread deleted", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                }}
              />,
            );
          }}
        />
      ))}
    </>
  );
}
