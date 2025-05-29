'use client';

import HoverButton from '@/components/buttons/hover-button';
import Avatar from '@/components/common/avatar';
import NoData from '@/components/common/no-data';
import UserName from '@/components/common/user-name';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import { onReportProblem } from '@/components/navbar/report-problem-action';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteComment, getComments } from '@/service/comment';
import { FEEDBACK_TYPE } from '@/service/feedback';
import useUserStore from '@/stores/user';
import dayjs from '@/utils/day';
import {
  AlertSquareIcon,
  Delete01Icon,
  MoreHorizontalIcon,
} from '@hugeicons/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast/headless';
import Spinner from '../spinner';
import AddComment from './add-comment';

export default function Comments({ sid }) {
  const userInfo = useUserStore((state) => state.userInfo);
  const confirm = useAlertStore((state) => state.confirm);
  const [comments, setComments] = useState([]);
  const [_total, setTotal] = useState(100);
  const commentsRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(
    async (page = 0) => {
      try {
        setLoading(true);
        const res = await getComments(sid);
        if (page === 0 && commentsRef.current) {
          commentsRef.current.scrollTop = 0;
        }
        setComments(res.comments);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    },
    [sid]
  );

  const deleteCommentHandle = (cid, uid) => {
    if (uid !== userInfo?.id) {
      return;
    }
    confirm({
      title: 'Delete Post?',
      message: (
        <span className="text-sm text-rs-text-primary">
          {`If you delete this post, you won't be able to restore it.`}
        </span>
      ),
      onConfirm: async () => {
        try {
          await deleteComment(cid);
          toast.success('Deleted');
          // 为了不改变用户观察位置，这里不调用 fetchComments
          setComments(comments.filter((c) => c.id !== cid));
        } catch (error) {
          toast.error('Delete failed');
        }
      },
      confirmLabel: <span className="text-red-500">Delete</span>,
    });
  };

  useEffect(() => {
    fetchComments();
  }, [sid]);

  return (
    <>
      <div
        ref={commentsRef}
        className="mx-6 flex-grow overflow-y-auto relative min-h-10"
      >
        {comments.map((c) => (
          <div className="flex my-2 gap-2" key={c.id}>
            <Avatar
              image={c.user.image}
              name={c.user.name}
              size={36}
              className="mt-2 flex-none cursor-pointer"
              uid={c.user.id}
            />
            <div className="w-full">
              <div className="flex justify-between mr-3 mt-1 -mb-1s h-[23px]">
                <div>
                  <UserName
                    name={c.user.name}
                    uid={c.user.id}
                    className="font-semibold text-sm mr-2"
                  />
                  <span className="text-xs mt-2 text-gray-500">
                    {dayjs(c.createdAt).fromNow(true)}
                  </span>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <HoverButton className="-mr-[9px] -mt-1.5">
                        <MoreHorizontalIcon
                          size={21}
                          className="text-rs-text-secondary"
                        />
                      </HoverButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl p-2 w-52"
                    >
                      <DropdownMenuItem
                        className="h-11 rounded-xl px-3 text-base font-semibold"
                        onClick={() =>
                          onReportProblem({
                            title: 'Report Comment',
                            type: FEEDBACK_TYPE.COMMENT,
                            data: {
                              commentId: c.id,
                            },
                          })
                        }
                      >
                        <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
                          Report
                          <AlertSquareIcon size={20} />
                        </div>
                      </DropdownMenuItem>
                      {c.user.id === userInfo?.id && (
                        <DropdownMenuItem
                          disabled={loading}
                          className="h-11 rounded-xl px-3 text-base"
                          onClick={() => deleteCommentHandle(c.id, c.user.id)}
                        >
                          <div className="flex gap-2 justify-between w-full cursor-pointer font-semibold text-red-500">
                            <span>Delete</span>
                            <Delete01Icon
                              size={20}
                              strokeWidth={2}
                              className="text-red-500"
                            />
                          </div>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="font-normal line-14 text-14px">{c.content}</div>
            </div>
          </div>
        ))}
        {loading ? <Spinner className="absolute top-20" /> : null}
        {comments.length === 0 && !loading ? (
          <NoData text="Write a comment" />
        ) : null}
      </div>
      <AddComment sid={sid} onAdd={fetchComments} />
    </>
  );
}
