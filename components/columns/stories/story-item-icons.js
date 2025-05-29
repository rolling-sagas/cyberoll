'use client';

import Link from 'next/link';
import CopyLinkItem from '@/components/popover/copy-link-item';
import DropdownWrap from '@/components/popover/dropdown-wrap';
import { dislikeStory, likeStory } from '@/service/story';
import HoverButton from '@/components/buttons/hover-button';
import {
  Comment02Icon,
  Edit02Icon,
  FavouriteIcon,
  Share01Icon,
} from '@hugeicons/react';
import { useState } from 'react';

export default function StoryItemIcons({
  story,
  showLike = true,
  showComment = true,
  onUpdateClick,
}) {
  const [likedByMe, setLikedByMe] = useState(story.likes?.length > 0);
  const [likeCount, setLikeCount] = useState(story._count?.likes || 0);

  return (
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
        <Link href={`/st/${story.slug || story.id}`} passHref scroll={false}>
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
          columns={[<CopyLinkItem key={story.id} path={`/st/${story.slug || story.id}`} />]}
        />
      )}
    </div>
  );
}
