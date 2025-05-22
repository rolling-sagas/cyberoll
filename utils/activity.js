import dayjs from '@/utils/day';

export const ACTIVITY_SUB_TYPE = {
  Like: 'like',
  Comment: 'comment',
  Follow: 'follow',
  SubscriotionSuccess: 'subscriotion_success',
  MonthlyCreditsUpdate: 'monthly_credits_update',
  SubscriotionWillRenewal: 'subscriotion_will_renewal',
  SubscriptionWillExpire: 'subscription_will_expire',
  PublishStory: 'publish_story',
  FirstPlayStory: 'first_play_story',

  BannedLogin: 'banned_login',
  BannedComment: 'banned_comment',
  BannedPublish: 'banned_publish',
  BannedAComment: 'banned_a_comment',
  BannedAStory: 'banned_a_story',
};

// Notification: 'notification',

function groupActivityDataByDate(data) {
  // 将 data按时间分组，分成 4 组: Today,This week,This month,Earlier
  // 为所有通知按照时间倒序，划分为Today（如有）, This week（7天内），This month（4周以内），Earlier
  const today = dayjs().startOf('day');
  const thisWeek = dayjs().subtract(7, 'day').startOf('day');
  const thisMonth = dayjs().subtract(4, 'week').startOf('day');

  const groups = [
    { duration: 'Today', items: [] },
    { duration: 'This week', items: [] },
    { duration: 'This month', items: [] },
    { duration: 'Earlier', items: [] },
  ];

  // TODO: 暂时不上 subscription
  return data
    .filter((item) => item.type !== 'subscription')
    .reduce((acc, item) => {
      const date = dayjs(item.createdAt);
      if (date >= today) {
        acc[0].items.push(item);
      } else if (date >= thisWeek) {
        acc[1].items.push(item);
      } else if (date >= thisMonth) {
        acc[2].items.push(item);
      } else {
        acc[3].items.push(item);
      }
      return acc;
    }, groups);
}

export { groupActivityDataByDate };
