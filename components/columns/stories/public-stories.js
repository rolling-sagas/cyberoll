'use client';
import { useEffect, useState } from 'react';

import PublicStoryItem from './story-item';

import { getPublicStories } from '@/service/story';
import ScrollSessions from '../sessions/scroll-sessions';

import { getSessions } from '@/service/session';
import usePageData from '@/components/hooks/use-page-data';
import PageDataStatus from '@/components/common/page-data-status';
import debounce from 'lodash/debounce';

export default function Stories() {
  const [
    stories,
    storiesTotal,
    storiesLoading,
    _,
    hasMoreStory,
    loadmoreStories,
  ] = usePageData(getPublicStories, 12, 'stories');

  const [sessions, setSessions] = useState([]);

  const listSessions = async () => {
    const list = await getSessions();
    setSessions(list);
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
      {sessions && sessions.length ? (
        <div className="mx-6 my-3">
          <ScrollSessions items={sessions} onDelete={listSessions} />
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
        />
      </div>
    </div>
  );
}
