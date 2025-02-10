'use client';
import StoryItem from "@/components/columns/stories/story-item";
import Comments from './comments'

export default function Story({ story }) {
  if (!story) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <StoryItem story={story} showPlay />
      <Comments sid={story.id} />
    </div>
  );
}
