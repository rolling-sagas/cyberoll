'use client';

import Image from 'next/legacy/image';
import { useState } from 'react';
import { generateBase64Svg } from '@/utils/utils';

export default function CunstomImage ({
  errorImage = '',
  blurDataURL = '',
  placeholder = 'blur',
  src,
  width,
  height,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [errorUrl] = useState(
    errorImage || generateBase64Svg(width, height, '404', 40)
  );
  const [blurUrl] = useState(
    blurDataURL || generateBase64Svg(width, height, 'Loading', 40)
  );

  const handleError = () => {
    setImgSrc(errorUrl);
  };

  return (
    <Image
      placeholder={placeholder}
      src={imgSrc}
      width={width}
      height={height}
      blurDataURL={blurUrl}
      {...props}
      onError={handleError}
    />
  );
}
