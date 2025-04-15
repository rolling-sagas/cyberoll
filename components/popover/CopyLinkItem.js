import toast from 'react-hot-toast/headless';
import { Link01Icon } from '@hugeicons/react';

export default function CopyLinkItem({ url }) {
  const copyLink = () => {
    console.log('copyLink', url);
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard', {
      duration: 2000,
      position: 'top-right',
    });
  };

  return (
    <div
      onClick={copyLink}
      className="flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
    >
      <span>Copy link</span>
      <Link01Icon size={16} className="text-muted-foreground" />
    </div>
  );
}
