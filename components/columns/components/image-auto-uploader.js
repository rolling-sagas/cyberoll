import { useState, useRef } from "react";
import { Image01Icon } from "@hugeicons/react";
import Image from "next/image";
import { IMAGE_HOST } from "@/components/common";
import { uploadImage } from '@/service/upload';
import Spinner from "../spinner";

export default function ImageAutoUploader({ value, onChange }) {
  const [pValue, setValue] = useState(value)
  const imageInput = useRef(null);
  const [localUrl, setLocalUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const url = pValue ? `${IMAGE_HOST}${pValue}/public` : ''

  return (
    <div className="flex flex-col w-full">
      <input
        ref={imageInput}
        type="file"
        accept="image/jpg,image/jpeg, image/png"
        style={{ display: "none" }}
        onChange={async (evt) => {
          evt.preventDefault();

          if (evt.target.files?.length === 0) {
            setValue('')
            setLocalUrl('')
            onChange('')
            return
          };
          const file = evt.target.files[0];
          setLoading(true)

          try {
            const {id} = await uploadImage(file)
            onChange(id);
            if (localUrl !== "") {
              URL.revokeObjectURL(localUrl);
            }
            const src = URL.createObjectURL(file);
            setLocalUrl(src);
          } catch (e) {
            console.error(e)
            setLocalUrl(localUrl);
          } finally {
            setLoading(false)
          }
        }}
      />

      <div className="w-full mt-2 relative">
        {localUrl || url ? (
          <Image
            src={localUrl || url}
            alt="image"
            width={480}
            height={320}
            className="w-full rounded-xl cursor-pointer"
            onClick={(evt) => {
              evt.preventDefault();
              if (!loading) imageInput.current.click();
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
        { loading ? <Spinner className="w-full absolute left-0 top-0 h-full bg-white bg-opacity-50 opacity-100"/> : null }
      </div>
    </div>
  );
}
