import { getImageUrl } from '@/utils/utils';

export default function Avatar({
  image,
  name = '',
  size = 32,
  className = 'cursor-pointer',
}) {
  const url = getImageUrl(image, '', 'avator');
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...(url ? { backgroundImage: `url(${url})` } : {}),
      }}
      title={name}
      className={`rounded-full flex bg-no-repeat bg-center bg-cover align-bottom outline-[0.5px] outline-foreground/10 outline -outline-offset-[0.5px] justify-center items-center ${className}`}
    >
      <span className="relative -z-10 uppercase font-bold">{name?.substring(0, 1)}</span>
    </div>
  );
}
