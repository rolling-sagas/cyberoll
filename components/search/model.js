import { search } from '@/service/search';

export const ITEMS_PER_PAGE = 15;

export async function fetchSearchResults(term, page = 0) {
  if (!term) return null;

  const skip = page * ITEMS_PER_PAGE;
  const results = await search(term, ITEMS_PER_PAGE, skip);
  return results;
}
