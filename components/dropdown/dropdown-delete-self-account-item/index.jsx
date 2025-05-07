'use client';

import { DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import { deleteSelf } from '@/service/user';
import { goLogout } from '@/utils/index';
import { Delete02Icon } from '@hugeicons/react';
import { toast } from 'react-hot-toast/headless';

export default function DropdownDeleteSelfAccountItem() {
  const confirm = useAlertStore((state) => state.confirm);

  const deleteAction = async () => {
    try {
      await deleteSelf();
      toast.success('Delete Success');
      goLogout();
    } catch (error) {
      console.error('Delete account failed:', error);
      toast.error('Delete failed');
    }
  };

  const onDeleteSelfHandle = () => {
    confirm({
      title: 'Delete Account',
      message: (
        <span className="text-sm text-rs-text-primary">
          Are you sure you want to delete your account? This will permanently
          erase all your data — including your stories, credits, subscriptions,
          and account details — and it cannot be recovered.
        </span>
      ),
      onConfirm: deleteAction,
      confirmLabel: <span className="text-red-500 font-semibold">Delete</span>,
    });
  };

  return (
    <DropdownMenuItem
      className="h-11 rounded-xl px-3 text-base font-semibold"
      onClick={onDeleteSelfHandle}
    >
      <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
        Delete account
        <Delete02Icon size={20} />
      </div>
    </DropdownMenuItem>
  );
}
