'use client';

import { useEffect } from 'react';
import SessionItem from './session-item';
import { getSessions } from '@/service/session';
import usePageData from '@/components/hooks/use-page-data';
import PageDataStatus from '@/components/common/page-data-status';
import debounce from 'lodash/debounce';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';

export default function SessionList() {
  const [sessions, total, loading, _, hasMore, loadMore, __, reset] = usePageData(
    getSessions,
    10,
    'sessions'
  );

  useEffect(() => {
    loadMore();
  }, []);

  const scrollHandle = debounce((e) => {
    const el = e.target;
    if (el.scrollTop + el.offsetHeight + 200 > el.scrollHeight) {
      loadMore();
    }
  }, 200);

  return (
    <div className="w-full h-full overflow-y-auto" onScroll={scrollHandle}>
      <div>
        {sessions.map((s) => (
          <SessionItem key={s.id} session={s} onDelete={reset} />
        ))}
        <PageDataStatus
          loading={loading}
          noData={total === 0}
          loadMore={hasMore}
          loadMoreHandle={() => loadMore()}
          noMoreData={!hasMore}
          loadingComp={<StoryListSkeleton />}
        />
      </div>
    </div>
  );
}
