import PublicStoryItem from './story-item';
import LastSession from './last-session';
import ifetch from '@/utils/ifetch';
import PublicStoriesClient from './public-stories-client';

export default async function PublicStories() {
  const { stories } = await ifetch(`/s/_/public?take=12&skip=0`);
  
  return (
    <div className="w-full h-full overflow-y-auto public-story-container">
      <div>
        <LastSession />
        {stories.map((story) => (
          <PublicStoryItem key={story.id} story={story} />
        ))}
        <PublicStoriesClient />
      </div>
    </div>
  );
}
