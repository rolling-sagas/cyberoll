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

import {
  BubbleChatNotificationIcon,
  Copy01Icon,
  Delete01Icon,
  Edit01Icon,
  Edit02Icon,
  Message02Icon,
  Share01Icon,
} from "@hugeicons/react";

import ToolButton from "./tool-button";
import { ItemMenuButton, MenuButtonItem } from "@/components/buttons/menu-button";

export default function StoryItem({
  story,
  onPlayStory,
  onUpdateClick,
  onDeleteClick,
  onEditClick,
  onDuplicateClick
}) {
  return (
    <div
      className="grid grid-cols-[48px_minmax(0,1fr)] px-6 py-3 cursor-pointer
      grid-rows-[21px_19px_max-content_max-conent] w-full border-b"
      onClick={(evt) => {
        evt.preventDefault();
        if (onPlayStory) onPlayStory(story);
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
            <ItemMenuButton>
              <MenuButtonItem
                left="Edit"
                right={<Edit01Icon size={20} />}
                onClick={(evt) => {
                  evt.stopPropagation();
                  if (onEditClick) onEditClick(story);
                }}
              />
              <MenuButtonItem
                left="Duplicate"
                right={<Copy01Icon size={20} />}
                onClick={(evt) => {
                  evt.stopPropagation();
                  onDuplicateClick();
                }}
              />
              <MenuButtonItem
                className="text-red-500"
                left="Delete"
                right={<Delete01Icon size={20} />}
                onClick={(evt) => {
                  evt.stopPropagation();
                  onDeleteClick();
                }}
              />
            </ItemMenuButton>
          </div>
        </div>
      </div>
      <div className="col-start-2 rows-start-2 row-span-2">
        {story.description ? (
          <div>{story.description}</div>
        ) : (
          <div className="text-rs-text-secondary">Empty description</div>
        )}
        <div
          className="flex flex-row mt-[6px] -ml-2 -mb-1 
          text-rs-text-tertiary gap-2"
        >
          <div
            className="w-9 h-9 flex justify-center 
            items-center text-rs-text-tertiary"
          >
            <ToolButton
              onClick={(evt) => {
                evt.stopPropagation();
                onUpdateClick();
              }}
            >
              <Edit02Icon size={18} strokeWidth={1.5} />
            </ToolButton>
          </div>
          <div
            className="w-9 h-9 flex justify-center 
            items-center text-rs-text-tertiary"
          >
            <ToolButton>
              <Share01Icon size={18} strokeWidth={1.5} />
            </ToolButton>
          </div>
        </div>
      </div>
    </div>
  );
}
