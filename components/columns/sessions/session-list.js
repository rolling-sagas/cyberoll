'use client';

import { useEffect, useState, useCallback } from 'react';
import SessionItem from './session-item';
import { getSessions } from '@/service/session';
import usePageData from '@/components/hooks/use-page-data';
import PageDataStatus from '@/components/common/page-data-status';
import debounce from 'lodash/debounce';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';
import { createSession } from '@/service/session';
import Avatar from '@/components/common/avatar';
import useUserStore from '@/stores/user';
import BaseButton from '@/components/buttons/base-button';
import { useRouter } from 'next/navigation';

export default function SessionList() {
  const [sessions, total, loading, _, hasMore, loadMore, __, reset, pageData] =
    usePageData(getSessions, 10, 'sessions');

  useEffect(() => {
    loadMore();
  }, []);

  const scrollHandle = debounce((e) => {
    const el = e.target;
    if (el.scrollTop + el.offsetHeight + 200 > el.scrollHeight) {
      loadMore();
    }
  }, 200);
  const router = useRouter();

  const userInfo = useUserStore((state) => state.userInfo);

  const [creatingSession, setCreatingSession] = useState(false);

  const play = useCallback(async () => {
    setCreatingSession(true);
    try {
      const seid = await createSession(pageData.randomSid);
      router.push(`/sess/${seid}`);
    } catch (e) {
      console.error(e);
      setCreatingSession(false);
    }
  }, [pageData]);

  return (
    <div className="w-full h-full overflow-y-auto" onScroll={scrollHandle}>
      <div>
        {sessions.map((s) => (
          <SessionItem key={s.id} session={s} onDelete={reset} />
        ))}
      </div>
      <PageDataStatus
        loading={loading}
        noData={total === 0}
        loadMore={hasMore}
        loadMoreHandle={() => loadMore()}
        noMoreData={!hasMore}
        loadingComp={<StoryListSkeleton />}
        noDataComp={
          pageData?.randomSid ? (
            <div className="w-full px-6 border-b -mt-4">
              <div className="flex flex-row py-4 items-center" onClick={play}>
                <Avatar
                  image={userInfo?.image}
                  size={36}
                  name={userInfo?.name}
                />
                <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
                  Looking for anything fun?
                </div>
                <BaseButton
                  disabled={creatingSession}
                  label={creatingSession ? 'Starting...' : 'Quick Start'}
                />
              </div>
            </div>
          ) : (
            <div>No data now!</div>
          )
        }
      />
    </div>
  );
}
