import BaseButton from '@/components/buttons/base-button';
import Avatar from '@/components/common/avatar';
import PageDataStatus from '@/components/common/page-data-status';
import usePageData from '@/components/hooks/use-page-data';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';
import { getActivities } from '@/service/activity';
import useUserStore from '@/stores/user';
import { groupActivityDataByDate } from '@/utils/activity';
import debounce from 'lodash/debounce';
import { useEffect } from 'react';
import { ActivityColumnLikeItem } from './activity-column-like-item';

export default function ActivityColumnWrap({ type }) {
  const userInfo = useUserStore((state) => state.userInfo);
  const [
    activities,
    total,
    loading,
    _,
    hasMore,
    loadMore,
    __,
    reset,
    pageData,
    resetByRest,
  ] = usePageData(getActivities, 10, 'activitys');

  useEffect(() => {
    console.log('exe 2');
    if (userInfo) {
      resetByRest(type);
    }
  }, [type, userInfo]);

  const scrollHandle = debounce((e) => {
    const el = e.target;
    if (el.scrollTop + el.offsetHeight + 200 > el.scrollHeight) {
      loadMore();
    }
  }, 200);

  return (
    <div className="w-full h-full overflow-y-auto" onScroll={scrollHandle}>
      <div>
        {groupActivityDataByDate(activities).map((g) => {
          return g.items.length > 0 ? (
            <div key={g.duration}>
              <div className="px-6 py-4 border-gray-200">
                <span className="font-semibold">{g.duration}</span>
              </div>
              {g.items.map((item) => {
                switch (item?.subType) {
                  case 'like':
                    return (
                      <ActivityColumnLikeItem
                        key={item.createdAt}
                        data={item}
                      />
                    );
                  case 'follow':
                    return <div key={item.createdAt}>follow</div>;
                  default:
                    return null;
                }
              })}
            </div>
          ) : null;
        })}
      </div>
      <PageDataStatus
        loading={loading}
        noData={total === 0}
        loadMore={hasMore}
        loadMoreHandle={() => loadMore()}
        noMoreData={!hasMore}
        loadingComp={<StoryListSkeleton />}
        noDataComp={
          pageData?.randomSid ? (
            <div className="w-full px-6 border-b -mt-4">
              <div className="flex flex-row py-4 items-center" onClick={play}>
                <Avatar
                  image={userInfo?.image}
                  size={36}
                  name={userInfo?.name}
                />
                <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
                  Looking for anything fun?
                </div>
                <BaseButton
                  disabled={creatingSession}
                  label={creatingSession ? 'Starting...' : 'Quick Start'}
                />
              </div>
            </div>
          ) : (
            <div>No activity yet</div>
          )
        }
      />
    </div>
  );
}
