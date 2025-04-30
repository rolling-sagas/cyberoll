'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import HoverButton from '@/components/buttons/hover-button';
import Avatar from '@/components/common/avatar';
import UserName from '@/components/common/user-name';
import { useModalStore } from '@/components/modal/dialog-placeholder';
import CopyLinkItem from '@/components/popover/copy-link-item';
import DropdownWrap from '@/components/popover/dropdown-wrap';
import { Button } from '@/components/ui/button';
import { createSession } from '@/service/session';
import { dislikeStory, likeStory } from '@/service/story';
import dayjs from '@/utils/day';
import { getImageUrl } from '@/utils/utils';
import {
  Activity01Icon,
  Comment02Icon,
  Copy01Icon,
  Delete01Icon,
  Edit02Icon,
  FavouriteIcon,
  MoreHorizontalIcon,
  PlayIcon,
  Share01Icon,
  ViewIcon,
  ViewOffIcon,
  AlertSquareIcon,
} from '@hugeicons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import Image from '../../common/custom-image';
import ResumeSession from './resume-session';
import { FEEDBACK_TYPE } from '@/service/feedback';
import { onReportProblem } from '@/components/navbar/report-problem-action';
import useUserStore from '@/stores/user';

const notSelfSotry = (userInfo, storyAuthorId) => {
  if(!userInfo?.id) return false;
  return userInfo?.id !== storyAuthorId;
};

export default function StoryItem({
  story,
  showLike = true,
  showViewActivity = false,
  showComment = true,
  onUpdateClick,
  onDuplicateClick,
  onDeleteClick,
  showPlay = false,
  showAllDesc = false,
  coverGoEdit = false,
  showPrivateStatus = false,
}) {
  const userInfo = useUserStore((state) => state.userInfo);
  const router = useRouter();
  const [likedByMe, setLikedByMe] = useState(story.likes?.length > 0);
  const [creatingSession, setCreatingSession] = useState(false);
  const [likeCount, setLikeCount] = useState(story._count?.likes || 0);
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);

  const play = useCallback(
    async (id) => {
      setCreatingSession(true);
      try {
        let seid = id;
        if (id === story.id) {
          seid = await createSession(story.id);
        }
        router.push(`/sess/${seid}`);
      } catch (e) {
        console.error(e);
        setCreatingSession(false);
      }
    },
    [story]
  );

  const checkHasSession = useCallback(() => {
    if (story.storySessions?.length) {
      openModal(
        <ResumeSession
          onCancel={closeModal}
          onStart={(id) => {
            play(id);
            closeModal();
          }}
          story={story}
        />
      );
    } else {
      play(story.id);
    }
  }, [story, openModal]);

  return (
    <div className="px-6 py-4 border-b-1 border-gray-200 last:border-none">
      <div className="flex gap-2 items-center mb-3 justify-between">
        <div className="flex gap-3 items-center">
          <Avatar
            image={story.author?.image}
            size={36}
            name={story.author?.name}
            uid={story.author?.id}
          />
          <span className="text-base flex gap-1.5">
            <UserName
              name={story.author?.name}
              uid={story.author?.id}
              className="font-semibold cursor-pointer"
            />
            <span className="text-zinc-400 font-light">
              {dayjs(story.updatedAt).fromNow()}
            </span>
          </span>
        </div>
        {showViewActivity || onDuplicateClick || onDeleteClick  || notSelfSotry(userInfo, story.authorId) ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <HoverButton className="-mr-[9px]">
                <MoreHorizontalIcon size={20} />
              </HoverButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-52">
              {showViewActivity ? (
                <DropdownMenuItem
                  className="h-11 rounded-xl px-3 text-base font-semibold"
                  onClick={() => router.push('/st/' + story.id)}
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                    View Activity
                    <Activity01Icon size={20} />
                  </div>
                </DropdownMenuItem>
              ) : null}
              {onDuplicateClick ? (
                <DropdownMenuItem
                  className="h-11 rounded-xl px-3 text-base"
                  onClick={onDuplicateClick}
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                    Duplicate
                    <Copy01Icon size={20} />
                  </div>
                </DropdownMenuItem>
              ) : null}
              {notSelfSotry(userInfo, story.authorId) ? (
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base font-semibold"
                onClick={() =>
                  onReportProblem({
                    title: 'Report Story',
                    type: FEEDBACK_TYPE.STORY,
                    data: {
                      storyId: story.id,
                    },
                  })
                }
              >
                <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
                  Report
                  <AlertSquareIcon size={20} />
                </div>
                </DropdownMenuItem>
              ) : null}
              {onDeleteClick ? (
                <DropdownMenuItem
                  className="h-11 rounded-xl px-3 text-base"
                  onClick={onDeleteClick}
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer text-red-500 font-semibold">
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
        className="w-full flex flex-col cursor-pointer mb-2 relative"
        onClick={() =>
          router.push(`/st/${story.id}${coverGoEdit ? '/edit' : ''}`)
        }
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
        {story.storySessions?.length ? (
          <div className="absolute top-4 right-0 px-2 bg-gray-300 rounded-l-md text-base">
            Recently Played
          </div>
        ) : null}
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
          <HoverButton onClick={onUpdateClick}>
            <Edit02Icon size={18} />
          </HoverButton>
        ) : null}
        {!story?.keepPrivate && (
          <DropdownWrap
            triggerChildren={
              <HoverButton>
                <Share01Icon size={18} />
              </HoverButton>
            }
            columns={[
              <CopyLinkItem
                key={story.id}
              />,
            ]}
          />
        )}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-nowrap text-base w-full overflow-hidden text-ellipsis">
          {showPrivateStatus ? (
            story.keepPrivate ? (
              <ViewOffIcon className="inline-block mr-1 align-top" size="22" />
            ) : (
              <ViewIcon className="inline-block mr-1 align-top" size="22" />
            )
          ) : null}
          {story.name}
        </span>
        <span
          className={`font-light text-sm ${showAllDesc ? '' : 'line-clamp-3'}`}
        >
          {story.description}
        </span>
      </div>
      {showPlay ? (
        <Button
          disabled={creatingSession}
          onClick={checkHasSession}
          className="w-full rounded-xl text-background mt-2"
        >
          {creatingSession ? 'Starting...' : 'Play'}{' '}
          <PlayIcon type="sharp" variant="solid" />
        </Button>
      ) : null}
    </div>
  );
}
