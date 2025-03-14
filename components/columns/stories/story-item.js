import dayjs from '@/utils/day';
import Image from '../../common/custom-image';
import Link from 'next/link';
import {
  FavouriteIcon,
  Comment02Icon,
  SentIcon,
  MoreHorizontalIcon,
  Edit02Icon,
  Edit01Icon,
  Copy01Icon,
  Delete01Icon,
  Share01Icon,
  PlayIcon,
} from '@hugeicons/react';
import { getImageUrl } from '@/utils/utils';
import { useState, useCallback } from 'react';
import { likeStory, dislikeStory } from '@/service/story';
import { createSession } from '@/service/session';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/common/avatar';
import HoverButton from '@/components/buttons/hover-button';

export default function StoryItem({
  story,
  showLike = true,
  showEdit = false,
  showComment = true,
  onUpdateClick,
  onDuplicateClick,
  onDeleteClick,
  showPlay = false,
  showAllDesc = false,
}) {
  const router = useRouter();
  const [likedByMe, setLikedByMe] = useState(story.likes?.length > 0);
  const [creatingSession, setCreatingSession] = useState(false);
  const [likeCount, setLikeCount] = useState(story._count?.likes || 0);
  const play = useCallback(async () => {
    setCreatingSession(true);
    try {
      const seid = await createSession(story.id);
      router.push(`/sess/${seid}`);
    } catch (e) {
      console.error(e);
      setCreatingSession(false);
    }
  }, [story]);

  return (
    <div className="mx-6 py-4 border-b-1 border-gray-200">
      <div className="flex gap-2 items-center mb-3 justify-between">
        <div className="flex gap-3 items-center">
          <Link href={`/u/${story.author?.id}`}>
            <Avatar
              image={story.author?.image}
              size={36}
              name={story.author?.name}
            />
          </Link>
          <span className="text-base flex gap-1.5">
            <span className="font-semibold">{story.author?.name}</span>
            <span className="text-zinc-400 font-light">
              {dayjs(story.updatedAt).fromNow()}
            </span>
          </span>
        </div>
        {showEdit || onDuplicateClick || onDeleteClick ? (
          <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
              <HoverButton className="-mr-[9px]">
                <MoreHorizontalIcon size={20} />
              </HoverButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-52">
              {showEdit ? (
                <DropdownMenuItem
                  className="h-11 rounded-xl px-3 text-base font-semibold"
                  onClick={() => router.push('/st/' + story.id + '/edit')}
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                    Edit
                    <Edit01Icon size={20} />
                  </div>
                </DropdownMenuItem>
              ) : null}
              {onDuplicateClick ? (
                <DropdownMenuItem className="h-11 rounded-xl px-3 text-base" onClick={onDuplicateClick}>
                  <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                    Duplicate
                    <Copy01Icon size={20} />
                  </div>
                </DropdownMenuItem>
              ) : null}
              {onDeleteClick ? (
                <DropdownMenuItem className="h-11 rounded-xl px-3 text-base" onClick={onDeleteClick}>
                  <div className="flex gap-10 justify-between w-full cursor-pointer text-red-500">
                    Delete
                    <Delete01Icon size={20} />
                  </div>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <div
        className="w-full flex flex-col cursor-pointer mb-2"
        onClick={() => router.push(`/st/${story.id}`)}
      >
        <Image
          src={getImageUrl(story.image)}
          width={470}
          height={310}
          objectFit="cover"
          className="rounded-lg"
          alt={story.name}
          priority
        />
      </div>
      <div className="flex flex-row items-center post-info gap-2 text-[#1f2937] mb-2 -ml-[10px]">
        {showLike ? (
          <HoverButton
            count={likeCount}
            onClick={async () => {
              setLikedByMe(!likedByMe);
              setLikeCount(likedByMe ? likeCount - 1 : likeCount + 1);
              try {
                if (likedByMe) {
                  await dislikeStory(story.id);
                } else {
                  await likeStory(story.id);
                }
              } catch (e) {
                console.error(e);
                setLikedByMe(likedByMe);
                setLikeCount(likeCount);
              }
            }}
          >
            <FavouriteIcon
              variant={likedByMe ? 'solid' : 'stroke'}
              color={likedByMe ? '#f44336' : 'currentColor'}
              size={18}
            />
          </HoverButton>
        ) : null}
        {showComment ? (
          <Link href={`/st/${story.id}`} passHref scroll={false}>
            <HoverButton count={story._count?.comments}>
              <Comment02Icon size={18} />
            </HoverButton>
          </Link>
        ) : null}
        {onUpdateClick ? (
          <HoverButton>
            <Edit02Icon onClick={onUpdateClick} size={18} />
          </HoverButton>
        ) : null}
        <HoverButton>
          <Share01Icon size={18} />
        </HoverButton>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-nowrap text-base">{story.name}</span>
        <span
          className={`font-light text-sm ${showAllDesc ? '' : 'line-clamp-3'}`}
        >
          {story.description}
        </span>
      </div>
      {showPlay ? (
        <Button
          disabled={creatingSession}
          onClick={play}
          className="w-full rounded-2xl text-background mt-2"
        >
          {creatingSession ? 'Creating Session...' : 'Play'}{' '}
          <PlayIcon type="sharp" variant="solid" />
        </Button>
      ) : null}
    </div>
  );
}
