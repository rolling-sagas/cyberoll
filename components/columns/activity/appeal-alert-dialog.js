'use client';

import { onReportProblem } from '@/components/navbar/report-problem-action';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAppealDialogStore } from '@/utils/appeal-dialog';

export function AppealAlertDialog() {
  const { isOpen, setIsOpen, content, style } = useAppealDialogStore();

  const handleAppeal = () => {
    setIsOpen(false);
    onReportProblem({ type: 'app' });
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-solid outline [&_[data-overlay-wrapper]]:bg-transparent"
    >
      <AlertDialogContent className="p-0 rounded-2xl flex flex-col max-w-[80vw] sm:max-w-[400px] shadow-lg overflow-hidden">
        <AlertDialogTitle className="text-center py-4 border-border -mb-6">
          Notification
        </AlertDialogTitle>
        <div
          className={`p-2 px-8 text-base leading-relaxed whitespace-pre-wrap break-words ${
            style?.content || ''
          }`}
        >
          {content}
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
  );
}
