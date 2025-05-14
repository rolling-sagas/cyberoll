import { useDebounce } from '@/app/hooks/use-debounce';
import { useCallback, useState } from 'react';
import { fetchSearchResults, ITEMS_PER_PAGE } from './model';

export function useSearchController() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // 初始搜索使用防抖
  const debouncedInitialSearch = useDebounce(async (term) => {
    if (!term) {
      setSearchResults(null);
      setHasMore(true);
      return;
    }

    try {
      setIsInitialLoading(true);
      setError(null);
      const results = await fetchSearchResults(term, 0);

      setSearchResults(results);
      setHasMore(results.stories.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('❌ Search error:', error);
      setError(error.message);
      setSearchResults(null);
    } finally {
      setIsInitialLoading(false);
    }
  }, 500);

  // 加载更多不使用防抖
  const loadMore = useCallback(async () => {
    if (!isLoadingMore && hasMore && searchTerm) {
      try {
        setIsLoadingMore(true);
        setError(null);
        const nextPage = page + 1;

        const results = await fetchSearchResults(searchTerm, nextPage);

        setSearchResults((prev) => ({
          total: results.total,
          stories: [...(prev?.stories || []), ...results.stories],
        }));

        const hasMoreResults = results.stories.length === ITEMS_PER_PAGE;
        setHasMore(hasMoreResults);
        setPage(nextPage);
      } catch (error) {
        console.error('❌ Load more error:', error);
        setError(error.message);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [isLoadingMore, hasMore, searchTerm, page, searchResults]);

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchTerm(value);
      setPage(0);
      setHasMore(true);
      setError(null);
      debouncedInitialSearch(value);
    },
    [debouncedInitialSearch]
  );

  return {
    searchTerm,
    searchResults,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    error,
    handleSearch,
    loadMore,
  };
}
