export const runtime = 'edge';

import Column from '@/components/column/column';
import Story from '@/components/columns/stories/story';
import Back from '@/components/common/back';
import ifetch from '@/utils/ifetch';

export default async function Page({ params }) {
  const story = await ifetch(`/s/${params.id}`);

  return (
    <>
      <Column headerLeft={<Back />} headerCenter={<div>{story?.name}</div>}>
        <Story story={story} />
      </Column>
    </>
  );
}
