'use client';
import { useEffect, useState } from 'react';

import PublicStoryItem from './story-item';

import { getPublicStories } from '@/service/story';
import SessionItem from '../sessions/session-item';

import { getSessions } from '@/service/session';
import usePageData from '@/components/hooks/use-page-data';
import PageDataStatus from '@/components/common/page-data-status';
import debounce from 'lodash/debounce';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';

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

  const listSessions = async () => {
    const {sessions: list} = await getSessions(0, 1);
    setSession(list[0]);
  };

  useEffect(() => {
    listSessions();
    loadmoreStories();
  }, []);

  const scrollHandle = debounce((e) => {
    const el = e.target;
    if (el.scrollTop + el.offsetHeight + 200 > el.scrollHeight) {
      loadmoreStories()
    }
  }, 200)

  return (
    <div className="w-full h-full overflow-y-auto" onScroll={scrollHandle}>
      {session ? (
        <SessionItem key={session.id} session={session} onDelete={listSessions} lastPlayed />
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
          noMoreDataComp={<div>More stories coming soon!</div>}
          loadingComp={<StoryListSkeleton />}
        />
      </div>
    </div>
  );
}
