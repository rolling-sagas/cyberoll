'use client';
import { useEffect } from 'react';

import PublicStoryItem from './story-item';
import { getPublicStories } from '@/service/story';
import usePageData from '@/components/hooks/use-page-data';
import PageDataStatus from '@/components/common/page-data-status';
import debounce from 'lodash/debounce';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';

export default function PublicStoriesClient() {
  const [
    stories,
    storiesTotal,
    storiesLoading,
    _,
    hasMoreStory,
    loadmoreStories,
  ] = usePageData(getPublicStories, 12, 'stories', undefined, 0);

  const scrollHandle = debounce((e) => {
    const el = e.target;
    if (el.scrollTop + el.offsetHeight + 200 > el.scrollHeight) {
      loadmoreStories();
    }
  }, 200);

  useEffect(() => {
    const el = document.querySelector('.public-story-container');
    if (el) el.addEventListener('scroll', scrollHandle, false);

    return () => el.removeEventListener('scroll', scrollHandle, false);
  }, [scrollHandle])

  return (
    <>
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
    </>
  );
}
