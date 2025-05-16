export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: 'My Page',
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
      <Column headerLeft={<Back />} headerCenter={<div>{story?.name}</div>}>
        <Story story={story} />
      </Column>
    </>
  );
}
