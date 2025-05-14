'use client';

import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';
import { IconInput } from '@/components/ui/icon-input';
import { Search01Icon } from '@hugeicons/react';
import { useEffect, useRef } from 'react';
import { useSearchController } from './ctrl';
import StoryList from './story-list';

export default function Search() {
  const {
    searchTerm,
    searchResults,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    error,
    handleSearch,
    loadMore,
  } = useSearchController();

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;

        if (isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px', // 提前100px触发加载
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <div className="w-full space-y-4 p-4">
      <IconInput
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full"
        icon={<Search01Icon size={20} />}
      />

      {error && <div className="text-sm text-red-500 text-center">{error}</div>}

      {isInitialLoading ? (
        <StoryListSkeleton />
      ) : searchResults ? (
        <>
          <StoryList stories={searchResults.stories} />

          {/* 加载更多触发器 */}
          {hasMore && (
            <div
              ref={observerTarget}
              className="h-4 w-full"
              data-testid="load-more-trigger"
            >
              {isLoadingMore && <StoryListSkeleton />}
            </div>
          )}

          {/* 状态提示 */}
          {!hasMore && searchResults.stories.length > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              No more results
            </div>
          )}
          {!hasMore && searchResults.stories.length === 0 && (
            <div className="text-sm text-muted-foreground text-center">
              No results found
            </div>
          )}
        </>
      ) : (
        <div className="text-sm text-muted-foreground text-center">
          Explore the stories
        </div>
      )}
    </div>
  );
}
