import { getImageUrl } from '@/utils/utils';
import Link from 'next/link';

export default function Avatar({
  image,
  name = '',
  size = 32,
  className = 'cursor-pointer',
  uid,
  href = '',
}) {
  const url = getImageUrl(image, '', 'avator');
  const link = href ? href : (uid ? `/u/${uid}` : undefined);
  const Component = link ? Link : 'span';

  return (
    <Component
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        ...(url ? { backgroundImage: `url(${url})` } : {}),
      }}
      title={name}
      className={`rounded-full flex bg-no-repeat bg-center bg-cover align-bottom outline-[0.5px] outline-foreground/10 outline -outline-offset-[0.5px] justify-center items-center ${className}`}
      href={link}
    >
      <span className="relative -z-10 uppercase font-bold">
        {name?.substring(0, 1)}
      </span>
    </Component>
  );
}

export function AvatarWithIcon({
  icon,
  name = '',
  size = 32,
  className = 'cursor-pointer',
}) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      title={name}
      className={`rounded-full flex bg-no-repeat bg-center bg-cover align-bottom outline-[0.5px] outline-foreground/10 outline -outline-offset-[0.5px] justify-center items-center ${className}`}
    >
      <span className="relative uppercase font-bold">{icon}</span>
    </div>
  );
}
