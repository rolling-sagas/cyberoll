import BaseButton from "@/components/buttons/base-button";

import { useModalStore } from "@/components/modal/dialog-placeholder";

import { useState } from "react";

import { TextIcon, Menu01Icon } from "@hugeicons/react";

import Dialog, { Input } from "@/components/modal/dialog";

export default function CreateChapterDialog({ name, desc, onConfirm, title }) {
  const closeModal = useModalStore((state) => state.close);

  const [tName, setTName] = useState(name || "");
  const [tDesc, setTDesc] = useState(desc || "");

  const canCreate = tName.trim().length > 0;

  return (
    <Dialog
      title={title ? title : (name ? "Edit chapter" : "New chapter")}
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
        <Input
          name="description"
          value={tDesc}
          onChange={setTDesc}
          icon=<Menu01Icon className="text-rs-text-secondary" size={24} />
          placeholder="Optional, can be changed later"
          autoSize={true}
        />
      }
      footer={
        <BaseButton
          label="Done"
          disabled={!canCreate}
          onClick={async () => {
            closeModal();
            onConfirm(tName, tDesc);
          }}
        />
      }
    />
  );
}
