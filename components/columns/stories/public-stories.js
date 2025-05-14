'use client';
import { useEffect, useState, useCallback } from 'react';

import PublicStoryItem from './story-item';

import { getPublicStories } from '@/service/story';
import SessionItem from '../sessions/session-item';

import { getSessions } from '@/service/session';
import usePageData from '@/components/hooks/use-page-data';
import PageDataStatus from '@/components/common/page-data-status';
import debounce from 'lodash/debounce';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';
import BaseButton from '@/components/buttons/base-button';
import { createSession } from '@/service/session';
import Avatar from '@/components/common/avatar';
import useUserStore from '@/stores/user';
import { useRouter } from 'next/navigation';

export default function Stories() {
  const [
    stories,
    storiesTotal,
    storiesLoading,
    _,
    hasMoreStory,
    loadmoreStories,
  ] = usePageData(getPublicStories, 12, 'stories');

  const [session, setSession] = useState(null);
  const [sid, setSid] = useState('');
  const userInfo = useUserStore((state) => state.userInfo);
  const router = useRouter();

  const listSessions = async () => {
    const { sessions: list, randomSid } = await getSessions(0, 1);
    setSession(list[0]);
    setSid(randomSid);
  };

  useEffect(() => {
    loadmoreStories();
  }, []);

  useEffect(() => {
    if (userInfo) {
      listSessions();
    }
  }, [userInfo])

  const scrollHandle = debounce((e) => {
    const el = e.target;
    if (el.scrollTop + el.offsetHeight + 200 > el.scrollHeight) {
      loadmoreStories();
    }
  }, 200);

  const [creatingSession, setCreatingSession] = useState(false);

  const play = useCallback(async () => {
    if (creatingSession) return;
    setCreatingSession(true);
    try {
      const seid = await createSession(sid);
      router.push(`/sess/${seid}`);
    } catch (e) {
      console.error(e);
      setCreatingSession(false);
    }
  }, [sid]);

  return (
    <div className="w-full h-full overflow-y-auto" onScroll={scrollHandle}>
      {session ? (
        <SessionItem
          key={session?.id}
          session={session}
          onDelete={listSessions}
          lastPlayed
        />
      ) : null}
      {!session && sid ? (
        <div className="w-full px-6 border-b">
          <div className="flex flex-row py-4 items-center" onClick={play}>
            <Avatar image={userInfo?.image} size={36} name={userInfo?.name} />
            <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
              Looking for anything fun?
            </div>
            <BaseButton
              disabled={creatingSession}
              label={creatingSession ? 'Starting...' : 'Quick Start'}
            />
          </div>
        </div>
      ) : null}
      <div>
        {stories.map((story) => (
          <PublicStoryItem key={story.id} story={story} />
        ))}
        <PageDataStatus
          loading={storiesLoading}
          noData={storiesTotal === 0}
          loadMore={hasMoreStory}
          loadMoreHandle={() => loadmoreStories()}
          noMoreData={!hasMoreStory}
          noMoreDataComp={
            <div className="text-rs-text-secondary">
              More stories coming soon!
            </div>
          }
          loadingComp={<StoryListSkeleton />}
        />
      </div>
    </div>
  );
}
