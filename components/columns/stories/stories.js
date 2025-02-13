'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import Spinner from '../spinner';
import BaseButton from '@/components/buttons/base-button';
import StoryItem from './story-item';

import { getStories } from '@/service/story';

import {
  onDeleteClick,
  CreateStory,
  onPlayStory,
  onUpdateClick,
  onDuplicateClick,
  onCreateClick,
} from './story-action';

export default function Stories() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const listStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStories();
      setStories(data.stories || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listStories();
  }, []);

  const onEditStory = (story) => {
    router.push('/st/' + story.id + '/edit');
  };

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">No story here.</div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => onCreateClick(listStories)}
        />
      </div>
    );
  }

  return (
    <>
      <CreateStory cb={listStories} />
      {stories.map((story) => (
        <StoryItem
          key={story.id}
          story={story}
          showLike={false}
          onPlayStory={() => onPlayStory(story, router)}
          showEdit
          onUpdateClick={() => onUpdateClick(story, listStories)}
          onDuplicateClick={() => {
            onDuplicateClick(story, router);
          }}
          onDeleteClick={() => onDeleteClick(story.id, listStories)}
        />
      ))}
    </>
  );
}
