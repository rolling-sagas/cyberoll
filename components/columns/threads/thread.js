import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import dayjs from "dayjs";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "1m",
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
  Edit02Icon,
  FavouriteIcon,
  Message02Icon,
  MoreHorizontalIcon,
  Share01Icon,
} from "@hugeicons/react";

import ToolButton from "./tool-button";

export default function Thread({ thread }) {
  return (
    <div
      className="grid grid-cols-[48px_auto] px-6 py-3 cursor-pointer
      grid-rows-[21px_19px_max-content_max-conent] w-full border-b"
      onClick={(evt) => {
        evt.preventDefault();
        console.log("enter thread");
      }}
    >
      <div
        className="pt-1 relative col-start-1 
        row-span-2 text-rs-text-secondary"
      >
        {thread._count.messages > 0 ? (
          <BubbleChatNotificationIcon variant="duotone" strokeWidth={1} />
        ) : (
          <BubbleChatNotificationIcon strokeWidth={1} />
        )}
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="flex flex-row items-start">
          <div className="flex-1">
            <span className="font-semibold">{thread.name}</span>
            <span className="text-rs-text-secondary ml-2">
              {dayjs(thread.createdAt).fromNow(true)}
            </span>
          </div>
          <ToolButton className="flex-0 text-rs-text-secondary">
            <MoreHorizontalIcon size={20} />
          </ToolButton>
        </div>
      </div>
      <div className="col-start-2 rows-start-2 row-span-2">
        {thread.description ? (
          <div>{thread.description}</div>
        ) : (
          <div className="text-rs-text-secondary">Empty description</div>
        )}
        <div
          className="flex flex-row mt-[6px] -ml-2 -mb-1 
          text-rs-text-tertiary"
        >
          <div className="w-9 h-9 flex justify-center items-center">
            <ToolButton
              onClick={(evt) => {
                evt.stopPropagation();
                console.log("message");
              }}
            >
              <Message02Icon size={18} strokeWidth={1.5} />
              {thread._count.messages > 0 && (
                <span className="text-[13px] ml-1 font-light">
                  {thread._count.messages}
                </span>
              )}
            </ToolButton>
          </div>
          <div
            className="w-9 h-9 flex justify-center 
            items-center text-rs-text-tertiary"
          >
            <ToolButton>
              <Edit02Icon size={18} strokeWidth={1.5} />
              {thread._count.messages > 0 && (
                <span className="text-[13px] ml-1 font-light">
                  {thread._count.messages}
                </span>
              )}
            </ToolButton>
          </div>
          <div
            className="w-9 h-9 flex justify-center 
            items-center text-rs-text-tertiary"
          >
            <ToolButton>
              <Share01Icon size={18} strokeWidth={1.5} />
              {thread._count.messages > 0 && (
                <span className="text-[13px] ml-1 font-light">
                  {thread._count.messages}
                </span>
              )}
            </ToolButton>
          </div>
        </div>
      </div>
    </div>
  );
}
