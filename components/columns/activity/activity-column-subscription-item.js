import { AvatarWithIcon } from '@/components/common/avatar';
import { ACTIVITY_SUB_TYPE } from '@/utils/activity';
import { parseJson } from '@/utils/utils';
import { CrownIcon } from '@hugeicons/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

function getRenewAndExpireDate(data) {
  const extraInfo = parseJson(data.extraInfo, '');
  if (extraInfo?.renewDate) {
    return dayjs(extraInfo?.end).format('YYYY/MM/DD');
  }
  return '';
}

function getText(subType, data) {
  switch (subType) {
    case ACTIVITY_SUB_TYPE.MonthlyCreditsUpdate:
      return 'Your monthly credits have been updated!';
    case ACTIVITY_SUB_TYPE.SubscriptionSuccess:
      return 'You have successfully subscribed Standard Monthly plan!';
    case ACTIVITY_SUB_TYPE.SubscriptionWillRenewal:
      return `Your subscription plan will automatically renew on ${getRenewAndExpireDate(
        data
      )}. Click to manage.`;
    case ACTIVITY_SUB_TYPE.SubscriptionWillExpire:
      return `Your subscription plan will expire on ${getRenewAndExpireDate(
        data
      )}. Renew now to keep enjoying premium features.`;
    default:
      return '';
  }
}

export function ActivityColumnSubscriptionItem({ data, subType }) {
  const router = useRouter();

  return (
    <div
      className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer hover:bg-rs-background-hover"
      onClick={() => {
        router.push(`/st/${data.story.id}`);
      }}
    >
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-3 items-center">
          <AvatarWithIcon
            icon={<CrownIcon className="text-amber-400" strokeWidth="2" />}
            size={36}
            name={data.user?.name || ''}
          />
          <span className="flex flex-col">
            <span className="text-base flex gap-1.5">
              <span>{getText(subType, data)}</span>
              <span className="text-zinc-400 font-light">
                {dayjs(data.createdAt).fromNow()}
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
