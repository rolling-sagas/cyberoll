import BaseButton from "@/components/buttons/base-button";

import { useModalStore } from "@/app/layout";

import { useState } from "react";

import { TextIcon, Menu01Icon } from "@hugeicons/react";

import Dialog, { Input } from "@/components/modal/dialog";

export default function CreateSessionDialog({ createAction }) {
  const closeModal = useModalStore((state) => state.close);

  const [tName, setTName] = useState("");
  const [tDesc, setTDesc] = useState("");

  const canCreate = tName.trim().length > 0;

  return (
    <Dialog
      title="New thread"
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
          label="Create"
          disabled={!canCreate}
          onClick={async () => {
            closeModal();
            console.log(createAction);
            await createAction(tName, tDesc);
          }}
        />
      }
    />
  );
}
