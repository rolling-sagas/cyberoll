import NoData from "./no-data";
import Spinner from "../columns/spinner";
import { Button } from "@/app/components/ui/button";

export default function PageDataStatus({
  loading = false,
  loadingComp,
  noData = false,
  noDataComp,
  loadMore = false,
  loadMoreComp,
  loadMoreHandle = () => {},
  className,
}) {
  let comp = null
  if (loading) {
    comp = loadingComp || <Spinner />
  } else if (noData) {
    comp = noDataComp || <NoData />
  } else if (loadMore) {
    comp = loadMoreComp || <Button variant="outline" onClick={loadMoreHandle} size="sm">Load more</Button>
  }
  return (
    <div className={`w-full text-center ${className}`}>
      {comp}
    </div>
  )
}
