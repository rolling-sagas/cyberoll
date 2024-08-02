import dayjs from "dayjs";

import {
  ArrowReloadHorizontalIcon,
  Copy01Icon,
  Delete01Icon,
  Edit02Icon,
} from "@hugeicons/react";

import ToolButton from "./tool-button";
import MenuButton from "@/components/buttons/menu-button";
import RoleIcon from "./role-icon";

import { useAlertStore } from "@/components/modal/alert-placeholder";
import Alert from "@/components/modal/alert";

export default function MessageItem({
  message,
  onUpdateClick,
  onDeleteClick,
  onGenerateClick,
}) {
  const openAlert = useAlertStore((state) => state.open);
  return (
    <div
      className="grid grid-cols-[48px_auto] px-6 py-3 h-fit
      grid-rows-[21px_19px_max-content_max-conent] w-full border-b"
    >
      <div
        className="pt-1 relative col-start-1 
        row-span-2 text-rs-text-secondary"
      >
        <RoleIcon role={message.role} />
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="flex flex-row items-start">
          <div className="flex-1">
            <span className="font-semibold capitalize">{message.role}</span>
            <span className="text-rs-text-secondary ml-2">
              {dayjs(message.updatedAt).fromNow(true)}
            </span>
          </div>
          <div className="flex-0">
            <MenuButton
              items={[
                {
                  className: "text-red-500",
                  label: "Delete",
                  right: <Delete01Icon size={24} />,
                  onClick: (evt) => {
                    evt.stopPropagation();
                    onDeleteClick();
                  },
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="col-start-2 rows-start-2 row-span-2 h-ful">
        {message.content ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div className="text-rs-text-secondary">Empty content</div>
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
              onClick={() => {
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
            <ToolButton
              onClick={() => {
                navigator.clipboard.writeText(message.content);
              }}
            >
              <Copy01Icon size={18} strokeWidth={1.5} />
            </ToolButton>
          </div>
          <div
            className="w-9 h-9 flex justify-center 
            items-center text-rs-text-tertiary"
          >
            <ToolButton
              onClick={() => {
                openAlert(
                  <Alert
                    title="Regenerate"
                    message="If you regenerate this message, then all subsequent messages will be effected."
                    confirmLabel="Proceed"
                    onConfirm={onGenerateClick}
                  />,
                );
              }}
            >
              <ArrowReloadHorizontalIcon size={18} strokeWidth={1.5} />
            </ToolButton>
          </div>
        </div>
      </div>
    </div>
  );
}
