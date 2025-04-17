import { useCallback, useState } from 'react';

/**
 * usePageData Hook to fetch paginated data. page start from 0
 *
 * @param {Function} getData - Function to fetch data. It should return a promise that resolves to an object with `items` and `total`.
 * @param {number} size - Number of items per page.
 * @param {string} itemsKey - res.data[itemsKey] is your list.
 * @param {string} totalKey - res.data[totalKey] is your total.
 */
export default function usePageData(
  getData,
  size,
  itemsKey = 'items',
  totalKey = 'total'
) {
  const [page, setPage] = useState(-1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);

  let hasMore = total === -1 || (page + 1) * size < total;

  const fetchData = useCallback(
    async (page, ...rest) => {
      setLoading(true);
      try {
        const res = await getData(page, size, ...rest);
        setTotal(res[totalKey]);
        setPageData(res);
        return res;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [size, getData]
  );

  const setPageNum = async (pageNumber, ...rest) => {
    try {
      setPage(pageNumber);
      const res = await fetchData(pageNumber, ...rest);
      setData(res[itemsKey]);
    } catch (e) {
      setPage(page);
    }
  };

  const loadmore = async (...rest) => {
    console.log('loadmore', loading, hasMore);
    if (loading || !hasMore) return;
    try {
      setPage(page + 1);
      const res = await fetchData(page + 1, ...rest);
      setData([...data, ...res[itemsKey]]);
    } catch (e) {
      setPage(page);
    }
  };

  const reset = () => {
    setPageNum(0);
  };

  const resetByRest = (...rest) => {
    hasMore = true;
    setData([]);
    setPageNum(0, ...(rest || []));
  };

  return [
    data,
    total,
    loading,
    page,
    hasMore,
    loadmore,
    setPageNum,
    reset,
    pageData,
    resetByRest,
  ];
}
