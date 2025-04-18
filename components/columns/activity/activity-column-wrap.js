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
import { ActivityColumnSubscriptionItem } from './activity-column-subscription-item';

const mockData = [
  {
    user: null,
    targetUser: {
      id: 'cm42eb9ku0000tunmf0o9dbo9',
      name: 'Luoyeshu',
      image: '409f5160-1fa2-4272-ab44-4b2b337cec00',
    },
    comment: null,
    story: null,
    type: 'subscription',
    subType: ACTIVITY_SUB_TYPE.MonthlyCreditsUpdate,
    createdAt: '2025-04-14T13:51:52.465Z',
    extraInfo: null,
  },
  {
    user: null,
    targetUser: {
      id: 'cm42eb9ku0000tunmf0o9dbo9',
      name: 'Luoyeshu',
      image: '409f5160-1fa2-4272-ab44-4b2b337cec00',
    },
    comment: null,
    story: null,
    type: 'subscription',
    subType: ACTIVITY_SUB_TYPE.SubscriotionWillRenewal,
    createdAt: '2025-05-14T13:51:52.465Z',
    extraInfo: JSON.stringify({
      end: '2025-05-14T13:53:52.465Z',
    }),
  },
  {
    user: null,
    targetUser: {
      id: 'cm42eb9ku0000tunmf0o9dbo9',
      name: 'Luoyeshu',
      image: '409f5160-1fa2-4272-ab44-4b2b337cec00',
    },
    comment: null,
    story: null,
    type: 'subscription',
    subType: ACTIVITY_SUB_TYPE.SubscriptionWillExpire,
    createdAt: '2025-01-14T13:51:52.465Z',
    extraInfo: JSON.stringify({
      end: '2025-05-14T13:51:52.465Z',
    }),
  },
  {
    user: null,
    targetUser: {
      id: 'cm42eb9ku0000tunmf0o9dbo9',
      name: 'Luoyeshu',
      image: '409f5160-1fa2-4272-ab44-4b2b337cec00',
    },
    comment: null,
    story: null,
    type: 'subscription',
    subType: ACTIVITY_SUB_TYPE.SubscriptionSuccess,
    createdAt: '2025-02-14T13:51:52.465Z',
    extraInfo: JSON.stringify({
      end: '2025-05-14T13:51:52.465Z',
    }),
  },
];

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
          g.items.unshift(...mockData);
          return g.items.length > 0 ? (
            <div key={g.duration} className="border-b-1 border-gray-200">
              <div className="px-6 py-4 border-gray-200">
                <span className="font-semibold">{g.duration}</span>
              </div>
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
            <div>
              {type === 'subscription'
                ? 'No subscription yet'
                : 'No activity yet'}
            </div>
          )
        }
      />
    </div>
  );
}
