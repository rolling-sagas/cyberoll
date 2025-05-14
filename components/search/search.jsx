'use client';

import { useDebounce } from '@/app/hooks/use-debounce';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';
import { Input } from '@/components/ui/input';
import { search } from '@/service/search';
import { Search01Icon } from '@hugeicons/react';
import { useCallback, useState } from 'react';
import StoryList from './story-list';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(async (term) => {
    if (!term) {
      setSearchResults(null);
      return;
    }

    try {
      setIsLoading(true);
      const results = await search(term);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  }, 500);

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      console.log('value', value);
      setSearchTerm(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  return (
    <div className="w-full space-y-4 p-4">
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full"
        icon={<Search01Icon size={20} />}
      />

      {isLoading ? (
        <StoryListSkeleton />
      ) : searchResults ? (
        searchResults?.stories?.length > 0 ? (
          <StoryList stories={searchResults.stories} />
        ) : (
          <div className="text-sm text-muted-foreground text-center">
            No results found
          </div>
        )
      ) : (
        <div className="text-sm text-muted-foreground text-center">
          Explore the stories
        </div>
      )}
    </div>
  );
}
