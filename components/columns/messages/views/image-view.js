'use-client'

import Image from "next/image";
import { getImageUrlById } from "@/components/images/utils";

export default function ImageView({ id, name }) {
  return (
    <Image
      src={getImageUrlById(id)}
      width={100}
      height={100}
      className="w-full h-full rounded-sm"
      alt={name}
    />
  );
}
