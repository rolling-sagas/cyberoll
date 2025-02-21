import dayjs from '@/utils/day';
import Image from '../../common/custom-image'
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
import Avator from '@/components/common/avator';

export default function StoryItem({
  story,
  showLike = true,
  showEdit = false,
  showComment = true,
  onUpdateClick,
  onDuplicateClick,
  onDeleteClick,
  showPlay = false,
}) {
  const router = useRouter();
  const [likedByMe, setLikedByMe] = useState(story.likes?.length > 0);
  const [creatingSession, setCreatingSession] = useState(false);
  const play = useCallback(async () => {
    setCreatingSession(true);
    try {
      const seid = await createSession(story.id);
      router.push(`/sess/${seid}`);
    } finally {
      setCreatingSession(false);
    }
  }, [story]);

  return (
    <div className="mx-6 py-3 border-b-1 border-gray-200">
      <div className="flex gap-2 items-center mb-3 justify-between">
        <div className="flex gap-2 items-center">
          <Link href={`/u/${story.author?.id}`}>
            <Avator image={story.author?.image} size={32} name={story.author?.name} />
          </Link>
          <span className="text-xs">
            <span className="font-semibold">{story.author?.name}</span>
            <span className="text-base-content/50 font-light">•</span>
            <span className="text-base-content/50 font-light">
              {dayjs(story.updatedAt).fromNow()}
            </span>
          </span>
        </div>
        {showEdit || onDuplicateClick || onDeleteClick ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {showEdit ? (
                <DropdownMenuItem
                  className="h-10"
                  onClick={() => router.push('/st/' + story.id + '/edit')}
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer">
                    Edit
                    <Edit01Icon size={18} />
                  </div>
                </DropdownMenuItem>
              ) : null}
              {onDuplicateClick ? (
                <DropdownMenuItem className="h-10" onClick={onDuplicateClick}>
                  <div className="flex gap-10 justify-between w-full cursor-pointer">
                    Duplicate
                    <Copy01Icon size={18} />
                  </div>
                </DropdownMenuItem>
              ) : null}
              {onDeleteClick ? (
                <DropdownMenuItem className="h-10" onClick={onDeleteClick}>
                  <div className="flex gap-10 justify-between w-full cursor-pointer text-red-500">
                    Delete
                    <Delete01Icon size={18} />
                  </div>
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      <div
        className="w-full flex flex-col cursor-pointer mb-3"
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
      <div className="flex flex-row items-center gap-4 post-info text-[#1f2937] mb-3">
        {showLike ? (
          likedByMe ? (
            <FavouriteIcon
              className="cursor-pointer"
              onClick={async () => {
                setLikedByMe(false);
                try {
                  await dislikeStory(story.id);
                } catch (e) {
                  console.error(e);
                  setLikedByMe(true);
                }
              }}
              variant="solid"
              color="#f44336"
              size={20}
            />
          ) : (
            <FavouriteIcon
              className="cursor-pointer"
              onClick={async () => {
                setLikedByMe(true);
                try {
                  await likeStory(story.id);
                } catch (e) {
                  console.error(e);
                  setLikedByMe(false);
                }
              }}
              variant="stroke"
              size={20}
            />
          )
        ) : null}
        {showComment ? (
          <Link href={`/st/${story.id}`} passHref scroll={false}>
            <Comment02Icon size={20} />
          </Link>
        ) : null}
        <SentIcon size={20} />
        {onUpdateClick ? (
          <Edit02Icon
            onClick={onUpdateClick}
            className="cursor-pointer"
            size={20}
          />
        ) : null}
        <Share01Icon className="cursor-pointer" size={20} />
      </div>
      <div className="inline post-info">
        <span className="font-semibold text-nowrap">{story.name}</span>
        <span className="font-light text-sm line-clamp-3">
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
