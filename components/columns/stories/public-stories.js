import PublicStoryItem from './story-item';
import LastSession from './last-session';
import ifetch from '@/utils/ifetch';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store'

export default async function PublicStories() {
  const { stories, total } = await ifetch(`/s/_/public?take=12&skip=0`);
  const hasMore = total > 12;
  
  return (
    <div className="w-full h-full overflow-y-auto">
      <div>
        <LastSession />
        {stories.map((story) => (
          <PublicStoryItem key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
