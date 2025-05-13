import StoryItem from "@/components/columns/stories/story-item";
import Comments from './comments'
import { onUpdateClick } from "./story-action";

// story or sid is needed
export default function Story({ story = null, sid, showUpdate = false }) {
  return (
    <>
      {
        story ? <div className="h-full flex flex-col overflow-y-auto">
          <StoryItem key={sid} showComment={false} story={story} showPlay showAllDesc onUpdateClick={showUpdate ? () => onUpdateClick(story, f) : null} />
          <Comments sid={story.id} />
        </div> : null
      }
    </>
  );
}
