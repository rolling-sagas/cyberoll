import { getImageUrl } from '@/utils/utils';
import { generateBase64Svg } from '@/utils/utils';

export default function Avator({ image, name = '', size = 32, className = '' }) {
  const def = generateBase64Svg(size, size, name.substring(0, 1), size / 2);
  const url = getImageUrl(image, def, 'avator');
  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      title={name}
      className={`rounded-full inline-block bg-no-repeat bg-center bg-cover cursor-pointer ${className} align-bottom`}
    />
  );
}
