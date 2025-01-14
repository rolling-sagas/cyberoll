'use client';
import { useState, useEffect } from 'react';
import dayjs from '@/utils/day';

import { getStory } from '@/service/story';

export default function Story({ storyId }) {

  const [story, setStory] = useState(null)

  useEffect(() => {
    const f = async () => {
      const data = await getStory(storyId)
      setStory(data)
    }
    f();
  }, [storyId]);

  if (!story) {
    return;
  }

  return (
    <div
      className="grid grid-cols-[48px_minmax(0,1fr)] px-6 py-3 cursor-pointer
      grid-rows-[21px_19px_max-content_max-conent] w-full border-b"
      onClick={evt => {
        evt.preventDefault();
        if (onPlayStory) onEditStory(story);
      }}
    >
      <div
        className="pt-1 relative col-start-1 
        row-span-2 text-rs-text-secondary"
      ></div>
      <div className="col-start-2 rows-start-1">
        <div className="flex flex-row items-start">
          <div className="flex-1">
            <span className="font-semibold">{story.name}</span>
            <span className="text-rs-text-secondary ml-2">
              {dayjs(story.updatedAt).fromNow(true)}
            </span>
          </div>
          <div className="flex-0"></div>
        </div>
      </div>
      <div className="col-start-2 rows-start-2 row-span-2">
        {story.description ? (
          <div>{story.description}</div>
        ) : (
          <div className="text-rs-text-secondary">Empty description</div>
        )}
      </div>
    </div>
  );
}
