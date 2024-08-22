import dayjs from "dayjs";

import { Copy01Icon, Delete01Icon, Edit02Icon } from "@hugeicons/react";

import { MenuButton, MenuButtonItem } from "@/components/buttons/menu-button";
import ToolButton from "../threads/tool-button";
import TypeIcon from "./type-icon";

import Image from "next/image";
import { getImageUrlById } from "@/components/images/utils";

export default function PropertyItem({
  property,
  onUpdateClick,
  onDeleteClick,
}) {
  return (
    <div
      className="grid grid-cols-[48px_auto] px-6 py-3 h-fit
      grid-rows-[21px_19px_max-content_max-conent] w-full border-b"
    >
      <div
        className="pt-1 relative col-start-1 
        row-span-2 text-rs-text-secondary"
      >
        <TypeIcon type={property.type} />
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="flex flex-row items-start">
          <div className="flex-1">
            <span className="font-semibold">{property.name}</span>
            <span className="text-rs-text-secondary ml-2">
              {dayjs(property.updatedAt).fromNow(true)}
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
        {property.type === "img" ? (
          <div>
            <Image
              src={getImageUrlById(JSON.parse(property.value).id)}
              width={720}
              height={360}
              className="w-full h-full rounded-xl"
              alt={JSON.parse(property.value).desc}
            />
            <div>{JSON.parse(property.value).desc}</div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">{property.value}</div>
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
                navigator.clipboard.writeText(property.value);
              }}
            >
              <Copy01Icon size={18} strokeWidth={1.5} />
            </ToolButton>
          </div>
        </div>
      </div>
    </div>
  );
}
