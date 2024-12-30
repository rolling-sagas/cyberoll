import dayjs from "@/components/day";
import Image from "next/legacy/image";
import Link from "next/link";
import { FavouriteIcon, Comment02Icon, SentIcon } from '@hugeicons/react';
import { getImageUrl } from "@/components/utils";
import { useState, useCallback } from "react";
import { likeStory, dislikeStory } from "@/service/story";
import { createSession } from "@/service/session";
import { useRouter } from 'next/navigation';

export default function PublicStoryItem({
  story,
}) {
  const router = useRouter();
  const [likedByMe, setLikedByMe] = useState(story.likes.length > 0)
  const play = useCallback(async () => {
    const seid = await createSession(story.id)
    router.push(`/sess/${seid}`)
  }, [story])

  return (
    <div className="mx-6 py-3 border-b-1 border-gray-200">
      <div className="flex gap-2 items-center mb-3">
        <img src={story.author.image} className="w-8 h-8 rounded-full" alt={story.author.name}/>
        <span className="text-xs">
          <span className="font-semibold">{story.author.name}</span>
          <span className="text-base-content/50 font-light">•</span>
          <span className="text-base-content/50 font-light">
            {dayjs(story.updatedAt).fromNow()}
          </span>
        </span>
      </div>
      <div
        className="w-full flex flex-col cursor-pointer mb-3"
        onClick={play}
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
