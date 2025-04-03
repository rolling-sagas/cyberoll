import dayjs from "dayjs";
import dynamic from "next/dynamic"
const CodeEditor = dynamic(() => import('@/components/editors/code-editor'),
  { ssr: false })

import {
  Copy01Icon, Delete01Icon, Edit02Icon,
  UnfoldLessIcon,
  UnfoldMoreIcon,
} from "@hugeicons/react";

import { ItemMenuButton as MenuButton, MenuButtonItem } from "@/components/buttons/menu-button";
import ToolButton from "../chapters/tool-button";
import TypeIcon from "./type-icon";

import Image from "next/image";
import { getImageUrl } from "@/utils/utils";
import { useState } from "react";

export default function ComponentItem({
  component,
  onUpdateClick,
  onDeleteClick,
}) {

  const [foldContent, setFoldContent] = useState(component.type === "func"
    || component.type === "obj")

  return (
    <div
      className="grid grid-cols-[48px_minmax(0,1fr)] px-6 py-3 h-fit
      grid-rows-[fit-content_19px_max-content_max-conent] w-full border-b"
    >
      <div
        className="pt-1 relative col-start-1 
        row-span-2 text-rs-text-secondary"
      >
        <TypeIcon type={component.type} />
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="flex flex-row items-start">
          <div className="flex-1">
            <span className="font-semibold">{component.name}</span>
            <span className="text-rs-text-secondary ml-2">
              {dayjs(component.updatedAt).fromNow(true)}
            </span>
          </div>
          <div className="flex-0">
            <MenuButton>
              <MenuButtonItem
                left="Delete"
                className="text-red-500"
                right={<Delete01Icon />}
                onClick={() => {
                  onDeleteClick();
                }}
              />
            </MenuButton>
          </div>
        </div>
      </div>
      <div className="col-start-2 rows-start-2 row-span-2 h-ful">
        {component.type === "img" ? (
          <div>
            <Image
              src={getImageUrl(JSON.parse(component.value).id)}
              width={720}
              height={360}
              className="w-full h-full rounded-xl"
              alt={JSON.parse(component.value).desc}
            />
            <div>{JSON.parse(component.value).desc}</div>
          </div>
        ) : (
          component.type !== "obj" && component.type !== "func" ?
            (
              !foldContent && <div className="whitespace-pre-wrap">{component.value}</div>
            ) : (
              !foldContent && <CodeEditor value={component.value}
                lang={component.type === "obj" ? "json" : "js"} />
            )
        )}
        <div
          className="flex flex-row mt-[6px] -ml-2 -mb-1 
          text-rs-text-tertiary gap-8 h-9 items-center"
        >
          <ToolButton
            onClick={() => {
              onUpdateClick();
            }}
          >
            <Edit02Icon size={18} strokeWidth={1.5} />
          </ToolButton>

          <ToolButton
            onClick={() => {
              navigator.clipboard.writeText(component.value);
            }}
          >
            <Copy01Icon size={18} strokeWidth={1.5} />
          </ToolButton>
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
  );
}
