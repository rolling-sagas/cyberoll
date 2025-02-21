import Image from '../../common/custom-image'
import {
  MoreHorizontalIcon,
  Delete01Icon,
  PlayIcon,
} from '@hugeicons/react';
import { getImageUrl } from '@/utils/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { deleteSession } from '@/service/session';

export default function SessionItem({
  session,
  onDelete,
}) {
  const router = useRouter();
  const [deletingSession, setDeletingSession] = useState(false);

  const del = async () => {
    if (deletingSession) return
    setDeletingSession(true)
    try {
      await deleteSession(session.id)
      onDelete(session.id)
    } finally {
      setDeletingSession(false)
    }
  }

  return (
    <div className="mx-6">
      <div
        className="w-full flex flex-col cursor-pointer mb-3 relative"
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
        <DropdownMenu>
          <DropdownMenuTrigger className='absolute top-2 right-2 border-1 rounded-full bg-background/80'>
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="h-10">
              <div className="flex gap-10 justify-between w-full cursor-pointer text-red-500" onClick={(e) => {
                e.stopPropagation();
                del()
              }}>
                Delete
                <Delete01Icon size={18} />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
