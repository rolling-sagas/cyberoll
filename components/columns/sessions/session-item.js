import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import HoverButton from '@/components/buttons/hover-button';
import Avatar from '@/components/common/avatar';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import { deleteSession } from '@/service/session';
import dayjs from '@/utils/day';
import { getImageUrl } from '@/utils/utils';
import { Delete01Icon, MoreHorizontalIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast/headless';
import Image from '../../common/custom-image';

export default function SessionItem({ session, onDelete, lastPlayed = false }) {
  const router = useRouter();
  const [deletingSession, setDeletingSession] = useState(false);
  const confirm = useAlertStore((state) => state.confirm);

  const del = async () => {
    confirm({
      title: 'Delete played story？',
      message:
        "If you delete this played story, you won't be able to restore it.",
      onConfirm: async () => {
        if (deletingSession) return;
        setDeletingSession(true);
        try {
          await deleteSession(session.id);
          toast.success('Deleted');
          onDelete(session.id);
        } finally {
          setDeletingSession(false);
        }
      },
      confirmLabel: 'Confirm',
    });
  };

  return (
    <div className="border-b-1 border-gray-200 py-4 px-6 last:border-none">
      <div className="flex gap-2 items-center mb-3 justify-between">
        <div className="flex gap-3 items-center">
          <Avatar
            image={session.avatar?.imageId}
            size={36}
            name={session.avatar?.name}
            href={`/sess/${session.id}`}
          />
          <span className="flex flex-col">
            <span className="font-semibold text-base/5">
              {session.avatar?.name}
              {lastPlayed ? (
                <span className="text-zinc-400 font-light ml-1.5 text-sm">
                  {dayjs(session.updatedAt).fromNow()}
                </span>
              ) : null}
            </span>
            <span className="text-zinc-400 font-light text-sm">
              {!lastPlayed &&
                `Last played: ${dayjs(session.updatedAt).fromNow()}`}
            </span>
          </span>
        </div>
        {lastPlayed ? null : (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <HoverButton className="-mr-[9px]">
                <MoreHorizontalIcon size={20} />
              </HoverButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-52">
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base"
                onClick={del}
              >
                <div className="flex gap-2 justify-between w-full cursor-pointer font-semibold text-red-500">
                  Delete
                  <Delete01Icon
                    size={20}
                    strokeWidth={2}
                    className="text-red-500"
                  />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div
        className="w-full flex flex-col cursor-pointer mb-2 relative"
        onClick={() => router.push(`/sess/${session.id}`)}
      >
        <Image
          src={getImageUrl(session.image)}
          width={470}
          height={310}
          objectFit="cover"
          className="rounded-lg"
          alt={session.name}
          priority
        />
        {lastPlayed && (
          <div className="absolute top-4 right-0 px-2 bg-gray-300 rounded-l-md text-base">
            Last played
          </div>
        )}
      </div>
      <div className="inline post-info">
        <span className="font-semibold text-nowrap">{session.name}</span>
        <span className="font-light text-sm line-clamp-1">
          {session.description}
        </span>
      </div>
    </div>
  );
}
