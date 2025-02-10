'use client';

import { useState, useEffect } from 'react';
import { getStory } from '@/service/story';
import PinnedColumns from '@/components/columns/pinned-columns';

import { useColumnsStore } from '@/components/columns/pinned-columns';
import Story from '@/components/columns/stories/story';

export default function Page({ params }) {
  const [story, setStory] = useState(null);

  useEffect(() => {
    const f = async () => {
      const data = await getStory(params.id);
      setStory(data);
    };
    f();
  }, [params.id]);

  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset();
    addColumn(
      'stories',
      { headerCenter: <div>My Stories</div> },
      <Story story={story} />
    );
  }, [addColumn, story]);

  return <PinnedColumns />;
}
