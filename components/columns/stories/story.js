'use client';
import StoryItem from "@/components/columns/stories/story-item";
import Comments from './comments'
import { useState, useEffect } from 'react';
import { getStory } from '@/service/story';
import { onUpdateClick } from "./story-action";

// story or sid is needed
export default function Story({ story = null, sid, showUpdate = false }) {
  const [storyItem, setStoryItem] = useState(null)

  const f = async () => {
    const data = await getStory(sid || story?.id);
    setStoryItem(data);
  };

  useEffect(() => {
    if (sid) {
      f();
    }
  }, [sid]);

  useEffect(() => {
    if (story) {
      setStoryItem(story)
    }
  }, [story]);

  return (
    <>
      {
        storyItem ? <div className="h-full flex flex-col">
          <StoryItem showComment={false} story={storyItem} showPlay onUpdateClick={showUpdate ? () => onUpdateClick(storyItem, f) : null} />
          <Comments sid={storyItem.id} />
        </div> : null
      }
    </>
  );
}
