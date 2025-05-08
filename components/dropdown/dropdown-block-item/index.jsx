import { DropdownMenuItem } from '@/app/components/ui/dropdown-menu';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import { createBlock, deleteBlock } from '@/service/block';
import { UserBlock02Icon } from '@hugeicons/react';
import { toast } from 'react-hot-toast/headless';
import { getMessage, getTitle } from './ctrl';

export default function DropdownBlockItem({
  type,
  basicData,
  targetName,
  blockId,
  onSuccessCallback = () => {},
}) {
  const confirm = useAlertStore((state) => state.confirm);

  const unblock = async () => {
    try {
      if (!blockId) {
        toast.error('blockId is undefined');
        return;
      }
      await deleteBlock(blockId);
      toast.success('Unblock Success');
      onSuccessCallback();
    } catch (error) {
      toast.error('Unblock failed');
    }
  };

  const block = async () => {
    try {
      const res = await createBlock(type, basicData);
      toast.success('Block Success');
      onSuccessCallback(res?.id);
    } catch (error) {
      toast.error('Block failed');
    }
  };

  const onBlockHandle = () => {
    confirm({
      title: getTitle(type, !!blockId, targetName),
      message: (
        <span className="text-sm text-rs-text-primary">
          {getMessage(type, !!blockId, targetName)}
        </span>
      ),
      onConfirm: async () => {
        blockId ? await unblock() : await block();
      },
      confirmLabel: (
        <span className="text-rs-text-primary font-semibold">
          {blockId ? 'Unblock' : 'Block'}
        </span>
      ),
    });
  };

  return (
    <DropdownMenuItem
      className="h-11 rounded-xl px-3 text-base font-semibold"
      onClick={onBlockHandle}
    >
      <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
        {blockId ? 'Unblock' : 'Block'}
        <UserBlock02Icon size={20} />
      </div>
    </DropdownMenuItem>
  );
}
