import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/modal/dialog";
import { Image01Icon } from "@hugeicons/react";
import Image from "next/image";

export default function ImageUploader({ value, onChange }) {
  const [pValue, setValue] = useState(value ? JSON.parse(value) : null)

  const imageInput = useRef(null);

  const [localUrl, setLocalUrl] = useState(null)
  const [localFile, setLocalFile] = useState(null);

  const url = pValue && pValue.id
    ? `https://imagedelivery.net/8VoaBhaig6kffmvxoWxkaw/${pValue.id}/public`
    : null;

  return (
    <div className="flex flex-col w-full">
      <Input
        name="Image"
        placeholder="Input image description here"
        value={pValue ? pValue.desc : ""}
        icon={<Image01Icon size={20} className="text-rs-text-secondary" />}
        onChange={(value) => {
          setValue({ ...pValue, desc: value });
          onChange(value, localFile);
        }}
      />

      <input
        ref={imageInput}
        type="file"
        accept="image/jpg,image/jpeg, image/png"
        style={{ display: "none" }}
        onChange={(evt) => {
          evt.preventDefault();

          if (evt.target.files?.length === 0) return;
          const file = evt.target.files[0];
          const src = URL.createObjectURL(file);

          if (localUrl !== "") {
            URL.revokeObjectURL(localUrl);
          }

          setLocalUrl(src);
          setLocalFile(file);

          onChange(pValue ? pValue.desc : "", file);
        }}
      />

      <div className="w-[calc(100%-48px)] mt-2 ml-[48px] relative">
        {localUrl || url ? (
          <Image
            src={localUrl || url}
            alt="image"
            width={480}
            height={320}
            className="w-full rounded-xl cursor-pointer"
            onClick={(evt) => {
              evt.preventDefault();
              imageInput.current.click();
            }}
          />
        ) : (
          <button
            className="w-full h-[240px] rounded-2xl flex justify-center 
              items-center bg-rs-background-1"
            onClick={(evt) => {
              evt.preventDefault();
              imageInput.current.click();
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <Image01Icon />
              <span>Upload Image</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
