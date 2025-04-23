import { AvatarWithIcon } from '@/components/common/avatar';
import { ACTIVITY_SUB_TYPE } from '@/utils/activity';
import { parseJson } from '@/utils/utils';
import { CrownIcon } from '@hugeicons/react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

function getRenewAndExpireDate(data) {
  const extraInfo = parseJson(data.extraInfo, '');
  if (extraInfo?.end) {
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
    case ACTIVITY_SUB_TYPE.SubscriotionWillRenewal:
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

// TODO: 现在订阅还没好，等好了再放开
const CAN_PUBLISH = false;

export function ActivityColumnSubscriptionItem({ data, subType }) {
  const router = useRouter();

  if (!CAN_PUBLISH) {
    return null;
  }

  return (
    <div
      className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer hover:bg-rs-background-hover"
      onClick={() => {
        router.push(`/pricing`);
      }}
    >
      <div className="flex gap-2 mr-[110px] items-center justify-between">
        <div className="flex gap-3 items-center">
          <AvatarWithIcon
            icon={<CrownIcon className="text-amber-400" strokeWidth="2" />}
            size={40}
            name={data.user?.name || ''}
          />
          <div className="flex-1 min-w-0">
            <div className="text-base text-foreground">
              <div className="flex flex-wrap gap-1.5">
                <span className="line-clamp-3 break-words gap-1.5">
                  <span>{getText(subType, data)}</span>
                  <span className="text-zinc-400 font-light whitespace-nowrap pl-[0.375rem]">
                    {dayjs(data.createdAt).fromNow()}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
