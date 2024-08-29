import dayjs from "dayjs";
import mustache from 'mustache'

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

export function ArrayToKeyValue(list) {
  const result = {}
  for (const item of list) {
    if (item.type === "obj" || item.type === "img") {
      try {
        result[item.name] = JSON.parse(item.value)
      } catch (e) {
        console.error("template render error")
      }
    } else if (item.type === "num") {
      result[item.name] = Number(item.value)
    } else {
      result[item.name] = item.value
    }
  }
  // console.log("key value:", list, result)
  return result
}

export default function MessageItem({
  message,
  props,
  onUpdateClick,
  onDeleteClick,
  onGenerateClick,
  onSend,
  onCall,
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
            <div className="whitespace-pre-wrap">{
              mustache.render(message.content, ArrayToKeyValue(props))
            }</div>
          ) : (
            <MessageContent
              content={message.content}
              props={props}
              actionNeeded={message.role === "assistant" && isFirst}
              onSend={(c) => {
                if (isFirst) {
                  onSend(c);
                } else {
                  openAlert(
                    <Alert
                      title="Previous message"
                      message="You can only 
                        click the buttons from last message."
                      confirmLabel="OK"
                    />,
                  );
                }
              }}
              onCall={(c) => {
                if (isFirst) {
                  onCall(c);
                } else {
                  openAlert(
                    <Alert
                      title="Previous message"
                      message="You can only 
                        click the buttons from last message."
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
