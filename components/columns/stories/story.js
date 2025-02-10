'use client';
import StoryItem from "@/components/columns/stories/story-item";

export default function Story({ story }) {
  if (!story) {
    return null;
  }

  return (
    <div>
      <StoryItem story={story} />
    </div>
  );
}
