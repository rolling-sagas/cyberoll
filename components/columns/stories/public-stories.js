'use client';
import { useEffect, useState } from 'react';
import { Button } from '@headlessui/react';

import Spinner from '../spinner';
import PublicStoryItem from './story-item';

import { getPublicStories } from '@/service/story';

export default function Stories() {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(100);
  const listStories = async (page) => {
    setLoading(true);
    try {
      const data = await getPublicStories(page);
      setStories([...stories, ...(data.stories || [])]);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listStories(page);
  }, [page]);

  if (stories.length === 0 && !loading) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">No story here.</div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto overflow-x-hidden scrollbar-none w-full">
      {stories.map((story) => (
        <PublicStoryItem key={story.id} story={story} />
      ))}
      <div className="text-center">
        {loading ? (
          <div className="flex w-full h-20 items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Button
            disabled={loading || page * 10 + 10 >= total}
            onClick={() => setPage(page + 1)}
            className="my-6"
          >
            {page * 10 + 10 >= total ? 'No more story' : 'Load more'}
          </Button>
        )}
      </div>
    </div>
  );
}
