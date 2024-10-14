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
import { parseError } from "@/components/utils";

const useThreadsStore = create((set) => ({
  threads: [],
  errors: [],

  loading: "pending",

  listThreads: async () => {
    const response = await fetch("/api/session");
    const res = await response.json();
    if (res.error) {
      throw res.error
    } else {
      set({ threads: res, loading: "loaded" });
    }
  },

  newThread: async (name, description) => {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: { name: name, description: description } }),
    });
    const res = await response.json();
    if (res.error) {
      throw res.error
    }
  },

  updateThread: async (id, name, description) => {
    const response = await fetch("/api/session/" + id, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: { name: name, description: description } }),
    });

    const res = await response.json();
    if (res.error) {
      throw res.error
    }
  },

  copyThread: async (id, name, description) => {
    const response = await fetch("/api/session/" + id + "/copy", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: { name: name, description: description } }),
    });
    const res = await response.json();
    if (res.error) {
      throw res.error
    }

    return res
  },

  deleteThread: async (id) => {
    const response = await fetch("/api/session/" + id, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    const res = await response.json();
    if (res.error) {
      throw res.error
    }
  },
}));

const CreateThread = function() {
  const openModal = useModalStore((state) => state.open);
  const newThread = useThreadsStore((state) => state.newThread);
  const listThreads = useThreadsStore((state) => state.listThreads);

  const openAlert = useAlertStore((state) => state.open);

  function AlertError(message) {
    openAlert(<Alert title="Oops, something wrong!"
      message={message}
      confirmLabel="OK" />)
  }

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(
            <CreateSessionDialog
              title={"Create thread"}
              onConfirm={async (name, desc) => {
                const tid = toast.loading("Creating thread...", {
                  icon: <Spinner />,
                });
                try {
                  await newThread(name, desc);
                  toast.success("Thread created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid)
                  AlertError("Can't create the thread: " + parseError(e))
                } finally {
                  await listThreads();
                }
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

  function AlertError(message) {
    openAlert(<Alert title="Oops, something wrong!"
      message={message}
      confirmLabel="OK" />)
  }

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
                  try {
                    await updateThread(thread.id, name, desc);
                    toast.success("Thread updated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't update the thread: " + parseError(e))
                  } finally {
                    await listThreads();
                    toast.dismiss(tid)
                  }
                }}
              />,
            );
          }}
          onDuplicateClick={() => {
            openModal(
              <CreateSessionDialog
                title="Duplicate thread"
                name={thread.name + " copy"}
                desc={thread.description}
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Duplicating thread...", {
                    icon: <Spinner />,
                  });
                  try {
                    const res = await copyThread(thread.id, name, desc);
                    router.push("/th/" + res.id)
                    toast.success("Thread duplicated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't dulicate the thread: " + parseError(e))
                  } finally {
                    toast.dismiss(tid)
                  }
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
                  try {

                    await deleteThread(thread.id);
                    toast.success("Thread deleted", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't delete the thread: " + parseError(e))
                  } finally {
                    await listThreads();
                    toast.dismiss(tid)
                  }
                }}
              />,
            );
          }}
        />
      ))}
    </>
  );
}
