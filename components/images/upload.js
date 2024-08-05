"use client";
import Image from "next/image";
import { create } from "zustand";
import { useModalStore } from "@/components/modal/dialog-placeholder";
import { useRef, useEffect } from "react";
import Cropper, { canvasPreview } from "./cropper";
import Link from "next/link";

export const useUploadStore = create((set) => ({
  blob: null,
  remoteUrl: "",
  localUrl: "",

  setBlob: (blob) =>
    set((state) => {
      if (blob === null && state.localUrl !== "") {
        URL.revokeObjectURL(state.localUrl);
      }
      return {
        blob: blob,
        initialized: !state.initialized && blob ? true : false,
      };
    }),

  setRemoteUrl: (url) => {
    return set({ remoteUrl: url });
  },

  setLocalUrl: (localUrl) => set({ localUrl }),

  clear: () =>
    set((state) => {
      if (state.localUrl !== "") {
        URL.revokeObjectURL(state.localUrl);
      }
      return { blob: null, remoteUrl: "", localUrl: "" };
    }),
}));

export default function Upload({
  picture,
  minWidth = 98,
  minHeight = 98,
  mask = "circle",
  onChange = null,
  errors = [],
}) {
  const open = useModalStore((state) => state.open);

  const { setBlob, setLocalUrl, clear } = useUploadStore();

  const blob = useUploadStore((state) => state.blob);
  const localUrl = useUploadStore((state) => state.localUrl);

  const preview = useRef(null);
  const imageInput = useRef(null);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  return (
    <div className="flex flex-row gap-2 flex-wrap md:flex-nowrap">
      <div
        className={`flex min-h-36 min-w-64 p-1
          justify-center items-center bg-base-200 rounded
          ${errors.length > 0 ? "border border-error" : ""}`}
      >
        {picture && picture !== "" && (
          <Image
            className={`w-auto h-[140px]
                ${mask === "circle" ? "rounded-full" : "rounded"}
                ${blob === null ? "" : "hidden"}
              `}
            src={picture}
            priority
            width={140}
            height={140}
            style={{ width: "auto" }}
            alt="Profile Picture"
          />
        )}
        <canvas
          className={`w-auto h-[140px]
                ${mask === "circle" ? "rounded-full" : "rounded"}
                ${blob === null ? "hidden" : ""}
              `}
          ref={preview}
        />
      </div>
      <div className="flex flex-col gap-2 flex-0">
        <span className="text-sm text-base-content/60">
          It’s recommended to use a picture that’s at least {minWidth} x{" "}
          {minHeight} pixels and 3MB or less. Use a PNG or JPG file. Make sure
          your picture follows the Rolling Sagas{" "}
          <Link href="#" className="link">
            Community Guidelines
          </Link>
          .
        </span>

        <div className="flex flex-row gap-2">
          <input
            type="file"
            ref={imageInput}
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onClick={(evt) => {
              evt.target.value = null;
            }}
            onChange={(evt) => {
              evt.preventDefault();
              if (evt.target.files?.length === 0) return;
              const src = URL.createObjectURL(evt.target.files[0]);
              if (localUrl !== "") {
                URL.revokeObjectURL(localUrl);
              }
              setLocalUrl(src);
              open(
                <Cropper
                  src={src}
                  onChange={async (img, crop) => {
                    const blob = await canvasPreview(
                      img,
                      preview.current,
                      crop,
                    );

                    setBlob(blob);
                    onChange(blob);
                  }}
                  minWidth={minWidth}
                  minHeight={minHeight}
                />,
              );
            }}
          />
          <button
            className="btn btn-link text-base-content"
            onClick={(evt) => {
              evt.preventDefault();
              imageInput.current.click();
            }}
          >
            CHANGE
          </button>
          <button
            className="btn btn-link text-base-content"
            onClick={(evt) => {
              evt.preventDefault();
              setBlob(null);
              onChange(null);
            }}
            disabled={blob === null}
          >
            REMOVE
          </button>
        </div>
      </div>
    </div>
  );
}
