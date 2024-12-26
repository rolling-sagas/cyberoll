import BaseButton from "@/components/buttons/base-button";

import { useModalStore } from "@/components/modal/dialog-placeholder";

import { useState } from "react";

import { TextIcon, Menu01Icon, Image01Icon } from "@hugeicons/react";

import Dialog, { Input } from "@/components/modal/dialog";
import ImageAutoUploader from "../components/image-auto-uploader";

export default function CreateStoryDialog({ name, desc, image, onConfirm, title }) {
  const closeModal = useModalStore((state) => state.close);

  const [tName, setTName] = useState(name || "");
  const [tDesc, setTDesc] = useState(desc || "");
  const [tImage, setTImage] = useState(image || "");

  const canCreate = tName.trim().length > 0;

  return (
    <Dialog
      title={title ? title : (name ? "Edit story" : "New story")}
      header={
        <Input
          name="name"
          autoFocus={true}
          value={tName}
          onChange={setTName}
          icon=<TextIcon className="text-rs-text-secondary" size={24} />
          placeholder="Unique, start with a letter"
        />
      }
      body={
        [
          <Input
            key="1"
            name="description"
            value={tDesc}
            onChange={setTDesc}
            icon=<Menu01Icon className="text-rs-text-secondary" size={24} />
            placeholder="Optional, can be changed later"
            autoSize={true}
          />,
          <div
            key="2"
            className="grid grid-cols-[48px_auto] mt-4 mb-[-20px]
            grid-rows-[21px_19px_max-content_max-conent]
            w-full"
          >
            <div className="pt-1 relative col-start-1 row-span-2">
              <div className="w-9 h-9">
                <Image01Icon className="text-rs-text-secondary" size={24} />
              </div>
            </div>
            <div className="font-semibold col-start-2 rows-start-1">image</div>
            <ImageAutoUploader
              value={tImage}
              onChange={(image) => {
                console.log(image)
                setTImage(image)
              }}
            />
          </div>,
        ]
      }
      footer={
        <BaseButton
          label="Done"
          disabled={!canCreate}
          onClick={async () => {
            closeModal();
            onConfirm(tName, tDesc, tImage);
          }}
        />
      }
    />
  );
}
