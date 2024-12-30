import dayjs from "@/components/day";

import {
  Copy01Icon,
  Delete01Icon,
  Edit02Icon,
  Message02Icon,
  ScrollIcon,
  Share01Icon,
} from "@hugeicons/react";

import ToolButton from "./tool-button";
import { ItemMenuButton, MenuButtonItem } from "@/components/buttons/menu-button";

export default function ChapterItem({
  chapter,
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
        if (onEditClick) onEditClick(chapter);
      }}
    >
      <div
        className="pt-1 relative col-start-1 
        row-span-2 text-rs-text-secondary"
      >
        {chapter._count.messages === 0 ? (
          <ScrollIcon variant="twotone" strokeWidth={1} />
        ) : (
          <ScrollIcon strokeWidth={1} />
        )}
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="flex flex-row items-start">
          <div className="flex-1">
            <span className="font-semibold">{chapter.name}</span>
            <span className="text-rs-text-secondary ml-2">
              {dayjs(chapter.updatedAt).fromNow(true)}
            </span>
          </div>
          <div className="flex-0">
            <ItemMenuButton>
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
        {chapter.description ? (
          <div>{chapter.description}</div>
        ) : (
          <div className="text-rs-text-secondary">Empty description</div>
        )}
        <div
          className="flex flex-row mt-[6px] -ml-2 -mb-1 
          text-rs-text-tertiary gap-2"
        >
          <div className="w-9 h-9 flex justify-center items-center">
            <ToolButton>
              <Message02Icon size={18} strokeWidth={1.5} />
              {chapter._count.messages > 0 && (
                <span className="text-[13px] ml-1 font-light">
                  {chapter._count.messages}
                </span>
              )}
            </ToolButton>
          </div>
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
