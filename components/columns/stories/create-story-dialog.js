import BaseButton from "@/components/buttons/base-button";

import { useModalStore } from "@/components/modal/dialog-placeholder";

import { useState } from "react";

import { TextIcon, Menu01Icon, Image01Icon, ViewIcon, ViewOffIcon } from "@hugeicons/react";

import Dialog, { Input } from "@/components/modal/dialog";
import ImageAutoUploader from "../components/image-auto-uploader";
import { Switch } from "@/app/components/ui/switch"

export default function CreateStoryDialog({ name, desc, image, keepPrivate = true, showPublicSwitch = false, onConfirm, title }) {
  const closeModal = useModalStore((state) => state.close);

  const [tName, setTName] = useState(name || "");
  const [tDesc, setTDesc] = useState(desc || "");
  const [tImage, setTImage] = useState(image || "");
  const [tKeepPrivate, setTKeepPrivate] = useState(keepPrivate);

  const canCreate = tName.trim().length > 0 && tDesc.trim().length > 0 && tImage.length > 0;

  return (
    <Dialog
      title={title ? title : (name ? "Edit story" : "New story")}
      header={<Input
        name="Name"
        autoFocus={true}
        value={tName}
        onChange={setTName}
        icon={<TextIcon className="text-rs-text-secondary" size={24} />}
        placeholder="Story name, required"
        maxLength={100}
      />}
      body={
        <>
          <Input
            key="1"
            name="Description"
            value={tDesc}
            onChange={setTDesc}
            icon={<Menu01Icon className="text-rs-text-secondary" size={24} />}
            placeholder="Description, required"
            autoSize={true}
            maxLength={400}
            className="mb-4"
          />
          <div
            key="2"
            className="grid grid-cols-[48px_auto]
            grid-rows-[21px_19px_max-content_max-conent]
            w-full"
          >
            <div className="pt-1 relative col-start-1 row-span-2">
              <div className="w-9 h-9">
                <Image01Icon className="text-rs-text-secondary" size={24} />
              </div>
            </div>
            <div className="font-semibold col-start-2 rows-start-1">Image</div>
            <ImageAutoUploader
              value={tImage}
              onChange={(image) => {
                console.log(image)
                setTImage(image)
              }}
            />
          </div>
          <>
            {
              showPublicSwitch ? <div
                key="3"
                className="grid grid-cols-[48px_auto] mt-4 mb-[-20px]
                grid-rows-[21px_19px_max-content_max-conent]
                w-full"
              >
                <div className="pt-1 relative col-start-1 row-span-2">
                  <div className="w-9 h-9">
                    {
                      tKeepPrivate ? <ViewOffIcon className="text-rs-text-secondary" size={24} /> : <ViewIcon className="text-rs-text-secondary" size={24} />
                    }
                  </div>
                </div>
                <div className="font-semibold col-start-2 rows-start-1 mb-2">is public to everyone</div>
                <div className="flex items-center gap-2">
                  <Switch checked={!tKeepPrivate} onCheckedChange={(v) => setTKeepPrivate(!v)} id="is-public-switch" />
                </div>
              </div> : null
            }
          </>
        </>
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
