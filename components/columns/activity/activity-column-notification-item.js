import { AvatarWithIcon } from '@/components/common/avatar';
import { onReportProblem } from '@/components/navbar/report-problem-action';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Notification02Icon } from '@hugeicons/react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { getText } from './model';

export function ActivityColumnNotificationItem({ data, subType }) {
  const [isOpen, setIsOpen] = useState(false);

  const showMsgModal = () => {
    console.log('data', subType);
    setIsOpen(true);
  };

  const handleAppeal = () => {
    setIsOpen(false);
    onReportProblem({ type: 'app' });
  };
  return (
    <>
      <div
        className="px-6 py-4 border-gray-200 bg-background hover:cursor-pointer hover:bg-rs-background-hover"
        onClick={showMsgModal}
      >
        <div className="flex gap-2 mr-[110px] items-center justify-between">
          <div className="flex gap-3 items-center">
            <AvatarWithIcon
              icon={
                <Notification02Icon className="text-gray-600" strokeWidth="2" />
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

      <AlertDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border-solid outline [&_[data-overlay-wrapper]]:bg-transparent"
      >
        <AlertDialogContent className="p-0 rounded-2xl flex flex-col max-w-[80vw] sm:max-w-[400px] shadow-lg overflow-hidden">
          <AlertDialogTitle className="text-center py-4 border-border -mb-6">
            Notification
          </AlertDialogTitle>
          <div className="p-2 px-8 text-base leading-relaxed whitespace-pre-wrap break-words">
            {getText(data)}
          </div>
          <div className="flex border-t border-border">
            <div
              onClick={handleAppeal}
              className="flex-1 h-12 flex items-center justify-center cursor-pointer border-r border-border font-medium hover:bg-muted/50 rounded-bl-2xl"
            >
              Appeal
            </div>
            <div
              onClick={() => setIsOpen(false)}
              className="flex-1 h-12 flex items-center justify-center cursor-pointer font-medium hover:bg-muted/50 rounded-br-2xl"
            >
              OK
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
