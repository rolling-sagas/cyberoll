import toast from 'react-hot-toast/headless';
import { Link01Icon } from '@hugeicons/react';

export default function CopyLinkItem({ text = '', path = '' }) {
  const copyLink = () => {
    let val = text;
    if (path) {
      val = location.origin + path;
    }
    navigator.clipboard.writeText(val);
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
