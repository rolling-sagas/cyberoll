import Avatar from '@/components/common/avatar';
import UserName from '@/components/common/user-name';
import dayjs from '@/utils/day';
import { getImageUrl } from '@/utils/utils';
import { ViewIcon, ViewOffIcon } from '@hugeicons/react';

import Link from 'next/link';
import Image from '../../common/custom-image';
import StoryItemDropdown from './story-item-dropdown';
import StoryItemIcons from './story-item-icons';
import StoryItemPlayButton from './story-item-play-button';

export default function StoryItem({
  story,
  showLike = true,
  showViewActivity = false,
  showComment = true,
  onUpdateClick,
  onDuplicateClick,
  onDeleteClick,
  showBlock = true,
  showPlay = false,
  showAllDesc = false,
  coverGoEdit = false,
  showPrivateStatus = false,
}) {
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
        <StoryItemDropdown
          story={story}
          showViewActivity={showViewActivity}
          onDuplicateClick={onDuplicateClick}
          onDeleteClick={onDeleteClick}
          showBlock={showBlock}
        />
      </div>
      <Link
        className="w-full flex flex-col cursor-pointer mb-2 relative"
        href={`/st/${coverGoEdit ? story.id : (story.slug || story.id)}${coverGoEdit ? '/edit' : ''}`}
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
            Recently played
          </div>
        ) : null}
      </Link>
      <StoryItemIcons
        story={story}
        showLike={showLike}
        showComment={showComment}
        onUpdateClick={onUpdateClick}
      />
      <div className="flex flex-col w-full">
        <h2 className="font-semibold text-base line-clamp-1">
          {showPrivateStatus ? (
            story.keepPrivate ? (
              <ViewOffIcon className="inline-block mr-1 align-top" size="22" />
            ) : (
              <ViewIcon className="inline-block mr-1 align-top" size="22" />
            )
          ) : null}
          {story.name}
        </h2>
        <span
          className={`font-light text-sm ${showAllDesc ? '' : 'line-clamp-3'}`}
        >
          {story.description}
        </span>
      </div>
      <StoryItemPlayButton story={story} showPlay={showPlay} />
    </div>
  );
}
