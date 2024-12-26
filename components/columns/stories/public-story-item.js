import dayjs from "@/components/day";
import Image from "next/legacy/image";
import Link from "next/link";
import { FavouriteIcon, Comment02Icon, SentIcon } from '@hugeicons/react';
import { getImageUrl } from "@/components/utils";
import { useState } from "react";
import { likeStory, dislikeStory } from "@/service/story";

export default function StoryItem({
  story,
}) {
  const [likedByMe, setLikedByMe] = useState(story.likes.length > 0)

  return (
    <div key={story.id} className="ml-6 mr-2 py-3 border-b-1 border-gray-200">
      <div className="flex gap-2 items-center mb-3">
        <img src={story.author.image} className="w-8 h-8 rounded-full" alt={story.author.name}/>
        <span className="text-xs">
          <span class="font-semibold">{story.author.name}</span>
          <span className="text-base-content/50 font-light">•</span>
          <span className="text-base-content/50 font-light">
            {dayjs(story.updatedAt).fromNow()}
          </span>
        </span>
      </div>
      <Link
        className="w-full flex flex-col cursor-pointer mb-3"
        href={`/play/${story.id}/start`}
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
      </Link>
      <div className="flex flex-row items-center gap-4 post-info text-[#1f2937] mb-3">
        {
          likedByMe ?
            <FavouriteIcon className="cursor-pointer" onClick={async () => {await dislikeStory(story.id); setLikedByMe(false)}} variant="solid" color="#f44336" size={20} /> :
            <FavouriteIcon className="cursor-pointer" onClick={async () => {await likeStory(story.id); setLikedByMe(true)}} variant="stroke" size={20} />
        }
        <Link href={`/s/${story.id}`} passHref scroll={false}>
          <Comment02Icon size={20} />
        </Link>
        <SentIcon size={20} />
      </div>
      <div className="inline post-info">
        <span className="font-semibold text-nowrap">{story.name}</span>
        <span className="font-light text-sm line-clamp-3">
          {story.description}
        </span>
      </div>
    </div>
  );
}
