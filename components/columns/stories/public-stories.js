import ifetch from '@/utils/ifetch';
import LastSession from './last-session';
import PublicStoriesClient from './public-stories-client';
import PublicStoryItem from './story-item';

export default async function PublicStories() {
  const [error, { stories }] = await ifetch(`/s/_/public?take=12&skip=0`);
  if (error) return error;

  return (
    <div className="w-full h-full overflow-y-auto public-story-container">
      <div>
        <LastSession />
        {(stories || []).map((story) => (
          <PublicStoryItem key={story.id} story={story} />
        ))}
        <PublicStoriesClient />
      </div>
    </div>
  );
}
