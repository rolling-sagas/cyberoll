import dayjs from "dayjs";

import {
  ArrowDown02Icon,
  ArrowReloadHorizontalIcon,
  Copy01Icon,
  Delete01Icon,
  Edit02Icon,
  ThirdBracketIcon,
  UnfoldLessIcon,
  UnfoldMoreIcon,
} from "@hugeicons/react";

import ToolButton from "./tool-button";
import { MenuButton, MenuButtonItem } from "@/components/buttons/menu-button";
import RoleIcon from "./role-icon";

import { useAlertStore } from "@/components/modal/alert-placeholder";
import Alert from "@/components/modal/alert";

import { useState } from "react";
import MessageContent from "./message-content";
import { MenuButtonDivider } from "../../buttons/menu-button";

export default function MessageItem({
  message,
  onUpdateClick,
  onDeleteClick,
  onGenerateClick,
  onChoiceSelect,
  isFirst,
}) {
  const openAlert = useAlertStore((state) => state.open);

  const [raw, setRaw] = useState(message.role === "system");

  const [foldContent, setFoldContent] = useState(message.role === "system");

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
            <MenuButton>
              {message.role !== "system" && (
                <>
                  <MenuButtonItem
                    left="Toggle Raw"
                    right={<ThirdBracketIcon />}
                    onClick={() => {
                      setRaw(!raw);
                    }}
                  />
                  <MenuButtonDivider />
                </>
              )}
              <MenuButtonItem
                left="Delete"
                className="text-red-500"
                right={<Delete01Icon />}
                onClick={() => {
                  onDeleteClick();
                }}
              />
              {isFirst ? null : (
                <MenuButtonItem
                  left="Delete below"
                  className="text-red-500"
                  right={<ArrowDown02Icon />}
                  onClick={() => {
                    onDeleteClick(true);
                  }}
                />
              )}
            </MenuButton>
          </div>
        </div>
      </div>
      <div className="col-start-2 rows-start-2 row-span-2 h-ful">
        {!foldContent &&
          (raw || message.role === "system" ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <MessageContent
              content={message.content}
              actionNeeded={message.role === "assistant"}
              onChoiceSelect={(c) => {
                if (isFirst) {
                  onChoiceSelect(c);
                } else {
                  openAlert(
                    <Alert
                      title="Previous choice"
                      message="You can only 
                        select the choices from last message."
                      confirmLabel="OK"
                    />,
                  );
                }
              }}
            />
          ))}
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

          {message.role === "assistant" && (
            <div
              className="w-9 h-9 flex justify-center 
            items-center text-rs-text-tertiary"
            >
              <ToolButton
                onClick={() => {
                  openAlert(
                    <Alert
                      title="Regenerate"
                      message="If you regenerate this message, 
                        then all subsequent messages will be effected."
                      confirmLabel="Proceed"
                      onConfirm={onGenerateClick}
                    />,
                  );
                }}
              >
                <ArrowReloadHorizontalIcon size={18} strokeWidth={1.5} />
              </ToolButton>
            </div>
          )}
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
            className="w-9 h-9 flex justify-center items-center 
            text-rs-text-tertiary"
          >
            <ToolButton
              onClick={() => {
                setFoldContent(!foldContent);
              }}
            >
              {foldContent ? (
                <UnfoldMoreIcon size={18} strokeWidth={1.5} />
              ) : (
                <UnfoldLessIcon size={18} strokeWidth={1.5} />
              )}
            </ToolButton>
          </div>
        </div>
      </div>
    </div>
  );
}
