export const runtime = 'edge';

import Column from '@/components/column/column';
import PublicStories from '@/components/columns/stories/public-stories';
import SessionList from '@/components/columns/sessions/session-list';
import TypeDropdown from '@/components/columns/stories/type-dropdown';

export default function Page({searchParams}) {
  const cur = searchParams.tab || 'discover';

  return (
    <>
    1111
      <Column
        headerCenter={
          <TypeDropdown />
        }
      >
        {cur === 'discover' ? <PublicStories /> : <SessionList />}
      </Column>
    </>
  );
}
