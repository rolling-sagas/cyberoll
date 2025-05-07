import { useModalStore } from "@/components/modal/dialog-placeholder";
import Image from "next/image";
import { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const TO_RADIANS = Math.PI / 180;

export function convertToPixelCrop(crop, containerWidth, containerHeight) {
  if (!crop.unit) {
    // eslint-disable-next-line
    return { ...defaultCrop, ...crop, unit: "px" };
  }

  if (crop.unit === "px") {
    // eslint-disable-next-line
    return { ...defaultCrop, ...crop, unit: "px" };
  }

  return {
    unit: "px",
    x: crop.x ? (crop.x * containerWidth) / 100 : 0,
    y: crop.y ? (crop.y * containerHeight) / 100 : 0,
    width: crop.width ? (crop.width * containerWidth) / 100 : 0,
    height: crop.height ? (crop.height * containerHeight) / 100 : 0,
  };
}

export async function canvasPreview(
  image,
  canvas, // preview
  crop,
  scale = 1,
  rotate = 0,
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1
  crop = convertToPixelCrop(crop, image.width, image.height);

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );

  ctx.restore();

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.8),
  );

  return blob;
}

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function Cropper({ src, onChange, minWidth, minHeight }) {
  const imgRef = useRef();
  const [crop, setCrop] = useState();
  const close = useModalStore((state) => state.close);
  const [scale, setScale] = useState(1);
  const [_error, setError] = useState();

  function onImageLoad(e) {
    // console.log(e.currentTarget);
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setScale(width / naturalWidth);

    if (naturalWidth < minWidth || naturalHeight < minHeight) {
      setError(["Image is less than the minimum size"]);
    }

    setCrop(centerAspectCrop(width, height, minWidth / minHeight));
  }

  const customImgLoader = ({ src }) => {
    return `${src}`;
  };

  return (
    <div>
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        aspect={minWidth / minHeight}
        minWidth={minWidth * scale}
        minHeight={minHeight * scale}
      >
        <Image
          ref={imgRef}
          loader={customImgLoader}
          src={src}
          onLoad={onImageLoad}
          alt="crop-img"
          width={512}
          height={512}
          unoptimized={false}
        />
      </ReactCrop>
      <div className="modal-action">
        <form method="dialog">
          <button
            className="btn"
            onClick={(evt) => {
              evt.preventDefault();
              close();
            }}
          >
            Cancel
          </button>
        </form>
        <form method="dialog">
          <button
            className="btn"
            onClick={(evt) => {
              evt.preventDefault();
              onChange(imgRef.current, crop);
              close();
            }}
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
