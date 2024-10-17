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
import StoryItem from "./story-item";

import { BubbleChatAddIcon, CheckmarkCircle01Icon } from "@hugeicons/react";
import CreateStoryDialog from "./create-story-dialog";
import { parseError } from "@/components/utils";

const useStoriesStore = create((set) => ({
  stories: [],
  errors: [],

  loading: "pending",

  listStories: async () => {
    const response = await fetch("/api/story");
    const res = await response.json();
    if (res.error) {
      throw res.error
    } else {
      set({ stories: res, loading: "loaded" });
    }
  },

  newStory: async (name, description) => {
    const response = await fetch("/api/story", {
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

  updateStory: async (id, name, description) => {
    const response = await fetch("/api/story/" + id, {
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

  copyStory: async (id, name, description, reset = true) => {
    const url = "/api/story/" + id + "/copy"
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

  deleteStory: async (id) => {
    const response = await fetch("/api/story/" + id, {
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

const CreateStory = function() {
  const openModal = useModalStore((state) => state.open);
  const newStory = useStoriesStore((state) => state.newStory);
  const listStories = useStoriesStore((state) => state.listStories);

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
            <CreateStoryDialog
              title={"Create story"}
              onConfirm={async (name, desc) => {
                const tid = toast.loading("Creating story...", {
                  icon: <Spinner />,
                });
                try {
                  await newStory(name, desc);
                  toast.success("Story created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid)
                  AlertError("Can't create the story: " + parseError(e))
                } finally {
                  await listStories();
                }
              }}
            />,
          )
        }
      >
        <BubbleChatAddIcon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Start a story
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
};

export default function Stories() {
  const router = useRouter()

  const loading = useStoriesStore((state) => state.loading);

  const listStories = useStoriesStore((state) => state.listStories);
  const newStory = useStoriesStore((state) => state.newStory);
  const copyStory = useStoriesStore((state) => state.copyStory);
  const updateStory = useStoriesStore((state) => state.updateStory);
  const deleteStory = useStoriesStore((state) => state.deleteStory);

  const stories = useStoriesStore((state) => state.stories);

  const openModal = useModalStore((state) => state.open);

  const openAlert = useAlertStore((state) => state.open);

  function AlertError(message) {
    openAlert(<Alert title="Oops, something wrong!"
      message={message}
      confirmLabel="OK" />)
  }

  useEffect(() => {
    listStories();
  }, [listStories]);

  const onEditStory = (story) => {
    router.push("/st/" + story.id)
  };

  const onPlayStory = (story) => {
    openModal(
      <CreateStoryDialog
        title="Play from this template"
        name={story.name + " copy"}
        desc={story.description}
        onConfirm={async (name, desc) => {
          const tid = toast.loading("Duplicating from the template", {
            icon: <Spinner />,
          });
          try {
            const res = await copyStory(story.id, name, desc, true);
            router.push("/ch/" + res.id)
            toast.success("Story duplicated", {
              id: tid,
              icon: <CheckmarkCircle01Icon />,
            });
          } catch (e) {
            AlertError("Can't dulicate the story: " + parseError(e))
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

  if (stories.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No story here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateStoryDialog
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Creating story...", {
                    icon: <Spinner />,
                  });
                  await newStory(name, desc);
                  await listStories();
                  toast.success("Story created", {
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
      <CreateStory />
      {stories.map((story) => (
        <StoryItem
          key={story.id}
          story={story}
          onPlayStory={onPlayStory}
          onEditClick={onEditStory}
          onUpdateClick={() => {
            openModal(
              <CreateStoryDialog
                name={story.name}
                desc={story.description}
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Updating story...", {
                    icon: <Spinner />,
                  });
                  try {
                    await updateStory(story.id, name, desc);
                    toast.success("Story updated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't update the story: " + parseError(e))
                  } finally {
                    await listStories();
                    toast.dismiss(tid)
                  }
                }}
              />,
            );
          }}
          onDuplicateClick={() => {
            openModal(
              <CreateStoryDialog
                title="Duplicate story"
                name={story.name + " copy"}
                desc={story.description}
                onConfirm={async (name, desc) => {
                  const tid = toast.loading("Duplicating story...", {
                    icon: <Spinner />,
                  });
                  try {
                    const res = await copyStory(story.id, name, desc, false);
                    router.push("/ch/" + res.id)
                    toast.success("Story duplicated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't dulicate the story: " + parseError(e))
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
                title="Delete story?"
                message="If you delete this story, 
                you won't be able to restore it."
                onConfirm={async () => {
                  const tid = toast.loading("Deleting story...", {
                    icon: <Spinner />,
                  });
                  try {

                    await deleteStory(story.id);
                    toast.success("Story deleted", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't delete the story: " + parseError(e))
                  } finally {
                    await listStories();
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
