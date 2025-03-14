'use-client'

import Image from "next/image";

export default function ImageView({ url, name }) {
  return (
    <>
      {
        url ? 
          <Image
            src={url}
            width={100}
            height={100}
            className="w-full h-full rounded-xl"
            alt={name}
          /> : null
      }
    </>
  );
}
