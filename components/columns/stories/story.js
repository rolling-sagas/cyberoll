"use client";

import { useRef } from "react";

import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import dayjs from "dayjs";
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "few secs",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1m",
    MM: "%dm",
    y: "1y",
    yy: "%dy",
  },
});

import toast from "react-hot-toast/headless";
import { useEffect } from "react";
import ToolButton from "./tool-button";
import { ItemMenuButton, MenuButtonItem } from "@/components/buttons/menu-button";
import { useRouter } from "next/navigation";


import { createStore, useStore } from "zustand";
import { Edit02Icon, Share01Icon } from "@hugeicons/react";

const createStoryStore = (storyId) =>
  createStore((set, get) => ({
    story: null,
    loading: "pending",

    getStory: async () => {
      const res = await fetch(`/api/story/${storyId}`);
      const story = await res.json();
      if (res.error) {
        throw res.error
      } else {
        set({ story: story, loading: "loaded" });
      }
    }
  }))

export default function Story({ storyId }) {
  const storeRef = useRef(createStoryStore(storyId));

  const getStory = useStore(storeRef.current, (state) => state.getStory);
  const story = useStore(storeRef.current, (state) => state.story);

  useEffect(() => {
    getStory();
  }, [getStory]);

  if (!story) {
    return
  }

  return (
    <div
      className="grid grid-cols-[48px_minmax(0,1fr)] px-6 py-3 cursor-pointer
      grid-rows-[21px_19px_max-content_max-conent] w-full border-b"
      onClick={(evt) => {
        evt.preventDefault();
        if (onPlayStory) onEditStory(story);
      }}
    >
      <div
        className="pt-1 relative col-start-1 
        row-span-2 text-rs-text-secondary"
      >
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="flex flex-row items-start">
          <div className="flex-1">
            <span className="font-semibold">{story.name}</span>
            <span className="text-rs-text-secondary ml-2">
              {dayjs(story.updatedAt).fromNow(true)}
            </span>
          </div>
          <div className="flex-0">
          </div>
        </div>
      </div>
      <div className="col-start-2 rows-start-2 row-span-2">
        {story.description ? (
          <div>{story.description}</div>
        ) : (
          <div className="text-rs-text-secondary">Empty description</div>
        )}
      </div>
    </div>
  )
}
