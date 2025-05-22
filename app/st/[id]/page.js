export const runtime = 'edge';

export const dynamic = 'force-dynamic';

import { DEFAULT_TDK } from '@/utils/const';
export async function generateMetadata({ params }) {
  const [err, story] = await ifetch(`/s/${params.id}`);
  if (err) return DEFAULT_TDK;
  return {
    title: `${story.name} - ${DEFAULT_TDK.title}`,
    description: `${story.description} - ${DEFAULT_TDK.description}`,
    keywords: [story.name, ...DEFAULT_TDK.keywords],
  };
}

import Column from '@/components/column/column';
import Story from '@/components/columns/stories/story';
import Back from '@/components/common/back';
import StoryViewTracker from '@/components/tracker/story-view-tracker';
import ifetch from '@/utils/ifetch';
export default async function Page({ params }) {
  const [err, story] = await ifetch(`/s/${params.id}`);

  if (err) return err;
  return (
    <>
      <StoryViewTracker story={story} />
      <Column headerLeft={<Back />} headerCenter={<h1 className='line-clamp-1'>{story?.name}</h1>}>
        <Story story={story} />
      </Column>
    </>
  );
}
