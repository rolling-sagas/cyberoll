import BaseButton from "@/components/buttons/base-button";

import { useModalStore } from "@/components/modal/dialog-placeholder";

import {
  Image01Icon,
  LabelIcon,
  Menu01Icon,
  Raw01Icon,
  TextIcon,
  TextNumberSignIcon,
  ToggleOnIcon,
} from "@hugeicons/react";

import Dialog, { Input } from "@/components/modal/dialog";

import SwitchTabs from "@/components/tabs/switch-tabs";

import { useState } from "react";
import ImageUploader from "./image-uploader";

const types = ["string", "number", "object", "image"];

const TypeSwitch = function ({ index, onChange }) {
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
          <span className="font-semibold capitalize">Type: {types[index]}</span>
        </div>
      </div>
      <div className="col-start-2 mt-1">
        <SwitchTabs
          onChange={onChange}
          index={index}
          items={[
            <TextIcon size={20} key={0} />,
            <TextNumberSignIcon size={20} key={1} />,
            <Raw01Icon size={20} key={2} />,
            <Image01Icon size={20} key={3} />,
          ]}
        />
      </div>
    </div>
  );
};

export default function CreatePropertyDialog({ name, type, value, onConfirm }) {
  const closeModal = useModalStore((state) => state.close);

  const [pName, setName] = useState(name || "");
  const [pType, setType] = useState(type || "string");
  const [pValue, setValue] = useState(value || "");

  const [image, setImage] = useState(null);
  const [imageDesc, setImageDesc] = useState("");

  const canCreate =
    (pValue.trim().length > 0 && pName.trim().length > 0) ||
    (pType === "image" && image !== null && imageDesc !== "");

  return (
    <Dialog
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
          <TypeSwitch
            index={types.indexOf(pType)}
            onChange={(idx) => {
              setType(types[idx]);
            }}
          />
          {pType !== "image" ? (
            <Input
              name="Value"
              value={pValue}
              onChange={setValue}
              icon=<Menu01Icon className="text-rs-text-secondary" size={20} />
              placeholder="Required, value of the property"
              autoSize={true}
            />
          ) : (
            <ImageUploader
              value={pValue}
              onChange={(desc, file) => {
                setImageDesc(desc);
                setImage(file);
              }}
            />
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
              onConfirm(pName, pType, pValue, imageDesc, image);
            }}
          />
        </div>
      }
    />
  );
}
