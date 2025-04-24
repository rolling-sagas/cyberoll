import { Button } from '@/app/components/ui/button';
import Spinner from '../columns/spinner';
import NoData from './no-data';

export default function PageDataStatus({
  loading = false,
  loadingComp,
  noData = false,
  noDataComp,
  noMoreData = false,
  noMoreDataComp,
  loadMore = false,
  loadMoreComp,
  loadMoreHandle = () => {},
  className = '',
  asChild = false,
}) {
  let comp = null;
  if (loading) {
    comp = loadingComp || <Spinner />;
  } else if (noData) {
    comp = noDataComp || <NoData />;
  } else if (noMoreData) {
    comp = noMoreDataComp || null;
  } else if (loadMore) {
    comp = loadMoreComp || (
      <Button variant="outline" onClick={loadMoreHandle} size="sm">
        Load more
      </Button>
    );
  }
  return (
    <>
      {asChild ? (
        comp
      ) : (
        <div className={`w-full text-center ${className} my-4`}>{comp}</div>
      )}
    </>
  );
}
