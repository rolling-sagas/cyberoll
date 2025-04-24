import { getImageUrl } from '@/utils/utils';
import { useRouter } from 'next/navigation';

export default function Avatar({
  image,
  name = '',
  size = 32,
  className = 'cursor-pointer',
  uid,
}) {
  const router = useRouter();
  const url = getImageUrl(image, '', 'avator');

  const gotoUser = (e) => {
    if (uid) {
      e.stopPropagation();
      router.push(`/u/${uid}`);
    }
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        ...(url ? { backgroundImage: `url(${url})` } : {}),
      }}
      title={name}
      className={`rounded-full flex bg-no-repeat bg-center bg-cover align-bottom outline-[0.5px] outline-foreground/10 outline -outline-offset-[0.5px] justify-center items-center ${className}`}
      onClick={gotoUser}
    >
      <span className="relative -z-10 uppercase font-bold">
        {name?.substring(0, 1)}
      </span>
    </div>
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
