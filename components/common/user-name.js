import { useRouter } from 'next/navigation';

export default function UserName({ name, uid, className }) {
  const router = useRouter();
  const gotoUser = (e) => {
    if (uid) {
      e.stopPropagation();
      router.push(`/u/${uid}`);
    }
  };
  return (
    <span
      className={`font-semibold cursor-pointer ${className}`}
      onClick={gotoUser}
    >
      {name}
    </span>
  );
}
