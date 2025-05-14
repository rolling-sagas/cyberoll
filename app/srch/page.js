'use client';
export const runtime = 'edge';

import PinnedColumns from '@/components/columns/pinned-columns';

import Column from '@/components/column/column';
import { useColumnsStore } from '@/components/columns/pinned-columns';
import Search from '@/components/search/search';
import { useEffect } from 'react';

export default function Page() {
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => reset(), []);

  return (
    <PinnedColumns>
      <Column headerLeft={null} headerCenter={<div>Search</div>}>
        <Search />
      </Column>
    </PinnedColumns>
  );
}
