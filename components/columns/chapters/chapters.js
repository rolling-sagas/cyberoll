"use client";
import toast from "react-hot-toast/headless";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { create, createStore, useStore } from "zustand";

import { useModalStore } from "@/components/modal/dialog-placeholder";
import { useAlertStore } from "@/components/modal/alert-placeholder";
import Alert from "@/components/modal/alert";

import Spinner from "../spinner";
import BaseButton from "@/components/buttons/base-button";
import ChapterItem from "./chapter-item";

import { BubbleChatAddIcon, CheckmarkCircle01Icon } from "@hugeicons/react";
import CreateChapterDialog from "./create-chapter-dialog";
import { parseError } from "@/components/utils";

const createChaptersStore = (storyId) =>
  createStore((set, get) => ({
    chapters: [],
    errors: [],

    loading: "pending",

    listChapters: async () => {
      const response = await fetch(`/api/story/${storyId}/chapter`);
      const res = await response.json();
      if (res.error) {
        throw res.error
      } else {
        set({ chapters: res, loading: "loaded" });
      }
    },

    newChapter: async (name, description) => {
      const response = await fetch(`/api/story/${storyId}/chapter`, {
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

    updateChapter: async (id, name, description) => {
      const response = await fetch(`/api/story/${storyId}/chapter/` + id, {
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

    copyChapter: async (id, name, description, reset = true) => {
      const url = `/api/story/${storyId}/chapter/` + id + "/copy"
      const search = new URLSearchParams({ reset: reset }).toString();
      console.log(url + "?" + search)
      const response = await fetch(url + "?" + search, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ data: { name, description } }),
      });
      const res = await response.json();
      if (res.error) {
        throw res.error
      }

      return res
    },

    deleteChapter: async (id) => {
      const response = await fetch(`/api/story/${storyId}/chapter/` + id, {
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

  }))

const useChaptersStore = create((set) => ({
  chapters: [],
  errors: [],

  loading: "pending",

  listChapters: async () => {
    const response = await fetch("/api/chapter");
    const res = await response.json();
    if (res.error) {
      throw res.error
    } else {
      set({ chapters: res, loading: "loaded" });
    }
  },

  newChapter: async (name, description) => {
    const response = await fetch("/api/chapter", {
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

  updateChapter: async (id, name, description) => {
    const response = await fetch("/api/chapter/" + id, {
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

  copyChapter: async (id, name, description, reset = true) => {
    const url = "/api/chapter/" + id + "/copy"
    const search = new URLSearchParams({ reset: reset }).toString();
    console.log(url + "?" + search)
    const response = await fetch(url + "?" + search, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ data: { name, description } }),
    });
    const res = await response.json();
    if (res.error) {
      throw res.error
    }

    return res
  },

  deleteChapter: async (id) => {
    const response = await fetch("/api/chapter/" + id, {
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

const CreateChapter = function() {
  const openModal = useModalStore((state) => state.open);
  const newChapter = useChaptersStore((state) => state.newChapter);
  const listChapters = useChaptersStore((state) => state.listChapters);

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
            <CreateChapterDialog
              title={"Create chapter"}
              onConfirm={async (name, desc) => {
                const tid = toast.loading("Creating chapter...", {
                  icon: <Spinner />,
                });
                try {
                  await newChapter(name, desc);
                  toast.success("Chapter created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid)
                  AlertError("Can't create the chapter: " + parseError(e))
                } finally {
                  await listChapters();
                }
              }}
            />,
          )
        }
      >
        <BubbleChatAddIcon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Start a chapter
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
};

export default function Chapters({ storyId }) {
  const router = useRouter()

  const storeRef = useRef(createChaptersStore(storyId));
  const listChapters = useStore(storeRef.current, (state) => state.listChapters);
  const newChapter = useStore(storeRef.current, (state) => state.newChapter);
  const copyChapter = useStore(storeRef.current, (state) => state.copyChapter);
  const updateChapter = useStore(storeRef.current, (state) => state.updateChapter);
  const deleteChapter = useStore(storeRef.current, (state) => state.deleteChapter);
  const chapters = useStore(storeRef.current, (state) => state.chapters);
  const loading = useStore(storeRef.current, (state) => state.loading);


  const openModal = useModalStore((state) => state.open);
  const openAlert = useAlertStore((state) => state.open);

  function AlertError(message) {
    openAlert(<Alert title="Oops, something wrong!"
      message={message}
      confirmLabel="OK" />)
  }

  useEffect(() => {
    listChapters();
  }, [listChapters]);

  const onEditChapter = (chapter) => {
    router.push("/ch/" + chapter.id)
  };

  const onPlayChapter = (chapter) => {
    openModal(
      <CreateChapterDialog
        title="Play from this template"
        name={chapter.name + " copy"}
        desc={chapter.description}
        onConfirm={async (name, desc) => {
          const tid = toast.loading("Duplicating from the template", {
            icon: <Spinner />,
          });
          try {
            const res = await copyChapter(chapter.id, name, desc, true);
            router.push("/ch/" + res.id)
            toast.success("Chapter duplicated", {
              id: tid,
              icon: <CheckmarkCircle01Icon />,
            });
          } catch (e) {
            AlertError("Can't dulicate the chapter: " + parseError(e))
          } finally {
            toast.dismiss(tid)
          }
        }}
      />,
    );
  }

  if (loading === "pending") {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No chapter here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateChapterDialog
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Creating chapter...", {
                    icon: <Spinner />,
                  });
                  await newChapter(name, desc);
                  await listChapters();
                  toast.success("Chapter created", {
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
      <CreateChapter />
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          chapter={chapter}
          onPlayChapter={onPlayChapter}
          onEditClick={onEditChapter}
          onUpdateClick={() => {
            openModal(
              <CreateChapterDialog
                name={chapter.name}
                desc={chapter.description}
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Updating chapter...", {
                    icon: <Spinner />,
                  });
                  try {
                    await updateChapter(chapter.id, name, desc);
                    toast.success("Chapter updated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't update the chapter: " + parseError(e))
                  } finally {
                    await listChapters();
                    toast.dismiss(tid)
                  }
                }}
              />,
            );
          }}
          onDuplicateClick={() => {
            openModal(
              <CreateChapterDialog
                title="Duplicate chapter"
                name={chapter.name + " copy"}
                desc={chapter.description}
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Duplicating chapter...", {
                    icon: <Spinner />,
                  });
                  try {
                    const res = await copyChapter(chapter.id, name, desc, false);
                    router.push("/ch/" + res.id)
                    toast.success("Chapter duplicated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't dulicate the chapter: " + parseError(e))
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
                title="Delete chapter?"
                message="If you delete this chapter, 
                you won't be able to restore it."
                onConfirm={async () => {
                  const tid = toast.loading("Deleting chapter...", {
                    icon: <Spinner />,
                  });
                  try {

                    await deleteChapter(chapter.id);
                    toast.success("Chapter deleted", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't delete the chapter: " + parseError(e))
                  } finally {
                    await listChapters();
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
