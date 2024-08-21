import BaseButton from "@/components/buttons/base-button";

import { useModalStore } from "@/components/modal/dialog-placeholder";

import {
  LabelIcon,
  Menu01Icon,
  ToggleOnIcon,
} from "@hugeicons/react";

import Dialog, { Input } from "@/components/modal/dialog";

import { useState } from "react";
import ImageUploader from "./image-uploader";
import ListBox from "@/components/list-box/list-box";

const dataTypes = [
  { key: "str", label: "string", value: "str" },
  { key: "num", label: "number", value: "num" },
  { key: "obj", label: "object", value: "obj" },
  { key: "func", label: "function", value: "func" },
  { key: "img", label: "image", value: "img" }
];

const TypeSwitch = function({ value, onChange }) {
  return (
    <div
      className="grid grid-cols-[48px_auto] 
      grid-rows-[21px_19px_max-content_max-conent]
      w-full"
    >
      <div className="pt-1 relative col-start-1 row-span-2">
        <div className="w-9 h-9 text-rs-text-secondary">
          <ToggleOnIcon size={20} />
        </div>
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="px-1">
          <span className="font-semibold capitalize">Type</span>
        </div>
      </div>
      <div className="col-start-2 mt-1">
        <ListBox list={dataTypes} value={value} onChange={onChange} />
      </div>
    </div>
  );
};

export default function CreatePropertyDialog({ name, type, value,
  onConfirm, onImageConfirm }) {

  const closeModal = useModalStore((state) => state.close);

  const [pName, setName] = useState(name || "");

  const [pType, setType] = useState(type || dataTypes[0].value)
  const [pValue, setValue] = useState(value || "")

  const [width, setWidth] = useState(560);

  const [image, setImage] = useState(null);
  const [imageDesc, setImageDesc] = useState("")

  const canCreate =
    pName.trim().length > 0 && ((pValue && pValue.trim().length > 0) ||
      (pType === "img" && image !== null && imageDesc !== ""));

  return (
    <Dialog
      width={width}
      title={name ? "Edit property" : "New property"}

      header={
        <Input
          name="Name"
          value={pName}
          onChange={setName}
          icon=<LabelIcon className="text-rs-text-secondary" size={20} />
          placeholder="Required and unique"
          autoFocus={true}
        />
      }

      body={
        <div className="flex flex-col gap-2">
          <TypeSwitch value={pType} onChange={(value) => {
            setValue("")
            setType(value)
          }} />

          {pType === "str" && (
            <Input
              name="Value"
              value={pValue}
              onChange={setValue}
              icon=<Menu01Icon className="text-rs-text-secondary" size={20} />
              placeholder="Required, value of the property"
              autoSize={true}
            />
          )}

          {pType === "num" && (
            <Input
              name="Value"
              value={pValue}
              onChange={setValue}
              icon=<Menu01Icon className="text-rs-text-secondary" size={20} />
              placeholder="Required, value of the property"
              autoSize={false}
            />
          )}

          {pType === "obj" && (
            <Input
              name="Value"
              value={pValue}
              onChange={setValue}
              icon=<Menu01Icon className="text-rs-text-secondary" size={20} />
              placeholder="Required, value of the property"
              autoSize={true}
            />
          )}

          {pType === "func" && (
            <div>
              <Input
                name="Value"
                value={pValue}
                onChange={setValue}
                icon=<Menu01Icon className="text-rs-text-secondary" size={20} />
                placeholder="Required, value of the property"
                autoSize={true}
              />
            </div>
          )}

          {pType === "img" && (
            <ImageUploader value={pValue} onChange={(desc, file) => {
              setImageDesc(desc)
              setImage(file)
            }} />
          )}
        </div>
      }

      footer={
        <div className="flex flex-row-reverse items-center w-full">
          <BaseButton
            label={name ? "Update" : "Create"}
            disabled={!canCreate}
            onClick={async () => {
              closeModal();
              if (pType === "img") {
                onImageConfirm(pName, imageDesc, image)
              } else {
                onConfirm(pName, pType, pValue);
              }
            }}
          />
        </div>
      }
    />
  );
}
