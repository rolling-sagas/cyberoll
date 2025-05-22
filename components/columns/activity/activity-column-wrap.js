import PageDataStatus from '@/components/common/page-data-status';
import usePageData from '@/components/hooks/use-page-data';
import StoryListSkeleton from '@/components/skeleton/story-list-skeleton';
import { getActivities } from '@/service/activity';
import useUserStore from '@/stores/user';
import { ACTIVITY_SUB_TYPE, groupActivityDataByDate } from '@/utils/activity';
import debounce from 'lodash/debounce';
import { useEffect } from 'react';
import { ActivityColumnCommentItem } from './activity-column-comment-item';
import { ActivityColumnFollowItem } from './activity-column-follow-item';
import { ActivityColumnLikeItem } from './activity-column-like-item';
import { ActivityColumnNotificationItem } from './activity-column-notification-item';
import { ActivityColumnSubscriptionItem } from './activity-column-subscription-item';

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
    _reset,
    _pageData,
    resetByRest,
  ] = usePageData(getActivities, 15, 'activitys');

  useEffect(() => {
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
            <div key={g.duration} className="border-b-1 border-gray-200">
              <div className="px-6 py-4 border-gray-200">
                <span className="font-semibold">{g.duration}</span>
              </div>
              {/* TODO: remove mock data */}
              {/* {[...g.items, ...mockSubscriptionItems].map((item) => { */}
              {g.items.map((item) => {
                switch (item?.subType) {
                  case ACTIVITY_SUB_TYPE.Like:
                  case ACTIVITY_SUB_TYPE.FirstPlayStory:
                  case ACTIVITY_SUB_TYPE.PublishStory:
                    return (
                      <ActivityColumnLikeItem
                        key={item.createdAt}
                        data={item}
                        subType={item?.subType}
                      />
                    );
                  case ACTIVITY_SUB_TYPE.Follow:
                    return (
                      <ActivityColumnFollowItem
                        key={item.createdAt}
                        data={item}
                      />
                    );
                  case ACTIVITY_SUB_TYPE.Comment:
                    return (
                      <ActivityColumnCommentItem
                        key={item.createdAt}
                        data={item}
                      />
                    );
                  case ACTIVITY_SUB_TYPE.MonthlyCreditsUpdate:
                  case ACTIVITY_SUB_TYPE.SubscriptionSuccess:
                  case ACTIVITY_SUB_TYPE.SubscriotionWillRenewal:
                  case ACTIVITY_SUB_TYPE.SubscriptionWillExpire:
                    return (
                      <ActivityColumnSubscriptionItem
                        key={item.createdAt}
                        data={item}
                        subType={item?.subType}
                      />
                    );
                  case ACTIVITY_SUB_TYPE.BannedLogin:
                  case ACTIVITY_SUB_TYPE.BannedComment:
                  case ACTIVITY_SUB_TYPE.BannedPublish:
                  case ACTIVITY_SUB_TYPE.BannedAComment:
                  case ACTIVITY_SUB_TYPE.BannedAStory:
                    return (
                      <ActivityColumnNotificationItem
                        key={item.createdAt}
                        subType={item?.subType}
                        s
                        data={item}
                      />
                    );
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
        loadMoreComp={<div></div>}
        noDataComp={
          <div>
            {type === 'subscription'
              ? 'No subscription yet'
              : 'No activity yet'}
          </div>
        }
      />
    </div>
  );
}
