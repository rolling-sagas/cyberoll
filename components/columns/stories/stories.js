'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import BaseButton from '@/components/buttons/base-button';
import StoryItem from './story-item';

import { getStories } from '@/service/story';

import {
  onDeleteClick,
  CreateStory,
  onUpdateClick,
  onDuplicateClick,
  onCreateClick,
} from './story-action';
import usePageData from '@/components/hooks/use-page-data';
import PageDataStatus from '@/components/common/page-data-status';

export default function Stories() {
  const router = useRouter();
  const [
    stories,
    storiesTotal,
    storiesLoading,
    _,
    hasMoreStory,
    loadmoreStories,
  ] = usePageData(getStories, 10, 'stories');

  useEffect(() => {
    loadmoreStories();
  }, []);

  return (
    <>
      <CreateStory router={router} />
      {stories.map((story) => (
        <StoryItem
          key={story.id}
          story={story}
          showLike={false}
          showEdit
          onUpdateClick={() => onUpdateClick(story, listStories)}
          onDuplicateClick={() => {
            onDuplicateClick(story, router);
          }}
          onDeleteClick={() => onDeleteClick(story.id, listStories)}
        />
      ))}
      <PageDataStatus
        loading={storiesLoading}
        noData={storiesTotal === 0}
        loadMore={hasMoreStory}
        loadMoreHandle={() => loadmoreStories()}
        noDataComp={
          (
            <div className="flex flex-col w-full h-full items-center justify-center">
              <div className="text-rs-text-secondary text-[16px]">No story here.</div>
              <BaseButton
                label="Create"
                className="mt-2"
                onClick={() => onCreateClick(undefined, router)}
              />
            </div>
          )
        }
      />
    </>
  );
}
