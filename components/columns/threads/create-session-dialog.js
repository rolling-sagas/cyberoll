import Button from "../button";

import { useModalStore } from "@/app/layout";

import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef, useState } from "react";

import { TextIcon, Menu01Icon } from "@hugeicons/react";

const Input = function ({
  name,
  placeholder,
  icon,
  value,
  onChange,
  autoFocus = false,
  autoSize = false,
}) {
  const inputEl = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      inputEl.current.focus();
    }
  }, []);

  return (
    <div
      className="grid grid-cols-[48px_auto] 
      grid-rows-[21px_19px_max-content_max-conent]
      w-full"
    >
      <div className="pt-1 relative col-start-1 row-span-2">
        <div className="w-9 h-9">{icon}</div>
      </div>
      <div className="font-semibold col-start-2 rows-start-1">{name}</div>
      {autoSize ? (
        <TextareaAutosize
          ref={inputEl}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          className="outline-none col-start-2 rows-start-1 resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          ref={inputEl}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="outline-none col-start-2 rows-start-1"
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

const Dialog = function ({ title, header, body, footer }) {
  return (
    <div className="flex flex-col">
      <div
        className="w-full h-[46px] flex flex-row 
        items-center justify-center"
      >
        <div className="font-semibold text-white text-[16px]">{title}</div>
      </div>
      <div className="px-6 mt-2 mb-4 ">
        <div
          className="bg-rs-background-2 
          border border-rs-border rounded-2xl w-[460px]"
        >
          <div className="pt-6 px-6">{header}</div>
          <div className="px-6 py-4">{body}</div>
          <div className="pb-6 px-6 flex flex-row-reverse items-center w-full">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <Button
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
