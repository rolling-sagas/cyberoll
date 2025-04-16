import toast from 'react-hot-toast/headless';
import { Link01Icon } from '@hugeicons/react';

export default function CopyLinkItem({ url }) {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard', {
      duration: 2000,
      position: 'top-right',
    });
  };

  return (
    <div
      onClick={copyLink}
      className="flex gap-10 justify-between w-full cursor-pointer font-semibold"
    >
      <span>Copy link</span>
      <Link01Icon size={20} />
    </div>
  );
}
