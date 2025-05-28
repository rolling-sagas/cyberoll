'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Activity01Icon,
  Copy01Icon,
  Delete01Icon,
  MoreHorizontalIcon,
  AlertSquareIcon,
} from '@hugeicons/react';
import { FEEDBACK_TYPE } from '@/service/feedback';
import HoverButton from '@/components/buttons/hover-button';
import { onReportProblem } from '@/components/navbar/report-problem-action';
import useUserStore from '@/stores/user';
import { useRouter } from 'next/navigation';
import DropdownBlockItem from '@/components/dropdown/dropdown-block-item';
import { BLOCK_TYPE } from '@/service/block';
import { useState, useEffect } from 'react';

const notSelfSotry = (userInfo, storyAuthorId) => {
  if (!userInfo?.id) return false;
  return userInfo?.id !== storyAuthorId;
};

export default function StoryItemDropdown({
  story,
  showViewActivity = false,
  onDuplicateClick,
  onDeleteClick,
  showBlock = true,
}) {
  const userInfo = useUserStore((state) => state.userInfo);
  const router = useRouter();

  const [blockId, setBlockId] = useState(story?.blockId);
  useEffect(() => {
    setBlockId(story?.blockId);
  }, [story]);

  return (
    <>
      {showViewActivity ||
      onDuplicateClick ||
      onDeleteClick ||
      notSelfSotry(userInfo, story.authorId) ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <HoverButton className="-mr-[9px]">
              <MoreHorizontalIcon size={20} />
            </HoverButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl p-2 w-52">
            {showViewActivity ? (
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base font-semibold"
                onClick={() => router.push(`/st/${story.slug || story.id}`)}
              >
                <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                  View Activity
                  <Activity01Icon size={20} />
                </div>
              </DropdownMenuItem>
            ) : null}
            {onDuplicateClick ? (
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base"
                onClick={onDuplicateClick}
              >
                <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold">
                  Duplicate
                  <Copy01Icon size={20} />
                </div>
              </DropdownMenuItem>
            ) : null}
            {showBlock && story?.author?.id !== userInfo?.id ? (
              <DropdownBlockItem
                type={BLOCK_TYPE.STORY}
                basicData={{
                  storyId: story.id,
                }}
                targetName={story?.name}
                blockId={blockId}
                onSuccessCallback={(bid) => {
                  setBlockId(bid ? bid : '');
                }}
              />
            ) : null}
            {notSelfSotry(userInfo, story.authorId) ? (
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base font-semibold"
                onClick={() =>
                  onReportProblem({
                    title: 'Report Story',
                    type: FEEDBACK_TYPE.STORY,
                    data: {
                      storyId: story.id,
                    },
                  })
                }
              >
                <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
                  Report
                  <AlertSquareIcon size={20} />
                </div>
              </DropdownMenuItem>
            ) : null}
            {onDeleteClick ? (
              <DropdownMenuItem
                className="h-11 rounded-xl px-3 text-base"
                onClick={onDeleteClick}
              >
                <div className="flex gap-10 justify-between w-full cursor-pointer text-red-500 font-semibold">
                  Delete
                  <Delete01Icon size={20} />
                </div>
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
}
