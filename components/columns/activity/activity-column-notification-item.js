import { AvatarWithIcon } from '@/components/common/avatar';
import { Notification02Icon } from '@hugeicons/react';
import dayjs from 'dayjs';
import { getText } from './model';

export function ActivityColumnNotificationItem({ data, subType }) {
  const showMsgModal = () => {
    console.log('data', subType);
  };

  return (
    <div
      className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer hover:bg-rs-background-hover"
      onClick={showMsgModal}
    >
      <div className="flex gap-2 mr-[110px] items-center justify-between">
        <div className="flex gap-3 items-center">
          <AvatarWithIcon
            icon={
              <Notification02Icon className="text-amber-400" strokeWidth="2" />
            }
            size={40}
            name="RollingSaga"
          />
          <div className="flex-1 min-w-0">
            <div className="text-base text-foreground">
              <div className="flex flex-wrap gap-1.5">
                <span className="line-clamp-3 break-words gap-1.5">
                  <span>{getText(data)}</span>
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
