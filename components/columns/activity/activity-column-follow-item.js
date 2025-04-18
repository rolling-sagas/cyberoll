import { Button } from '@/app/components/ui/button';
import Avatar from '@/components/common/avatar';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { toggleFollowUser } from '@/service/relation';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';

export function ActivityColumnFollowItem({ data }) {
  // 0、init var
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  // 1、ctrl
  useEffect(() => {
    const ret = (data.user?.followers || []).some(
      (item) => item.followerId === data.targetUser.id
    );
    setIsFollowing(ret);
  }, [data]);

  const handleFollow = async () => {
    if (isFollowing || isLoading) return;
    setIsLoading(true);
    try {
      await toggleFollowUser(data.user.id, true);
      setIsFollowing(true);
    } catch (error) {
      toast.error('Following failed', {
        id: tid,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      setShowUnfollowDialog(false);
      await toggleFollowUser(data.user.id, false);
      setIsFollowing(false);
    } catch (error) {
      toast.error('Unfollowing failed');
    } finally {
      toast.success('Unfollowing success');
      setIsLoading(false);
    }
  };

  // 3、view
  return (
    <>
      <div className="px-6 py-4 border-gray-200 bg-background  hover:bg-rs-background-hover">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-3 items-center">
            <Avatar
              className="cursor-pointer mt-1"
              image={data.user.image}
              size={36}
              name={data.user.name}
            />
            <span className="flex flex-col">
              <span className="text-base flex gap-1.5">
                <span className="font-semibold">{data.user.name}</span>
                <span className="text-zinc-400 font-light">
                  {dayjs(data.createdAt).fromNow()}
                </span>
              </span>
              <span className="">started following you.</span>
            </span>
          </div>
          <div className="flex items-center">
            <Button
              variant={isFollowing ? 'outline' : ''}
              className={`min-w-[100px] rounded-[10px] ${
                isFollowing
                  ? 'hover:bg-backgroundhover border-1 text-zinc-400 hover:text-zinc-400'
                  : ''
              }`}
              onClick={() => {
                isFollowing ? setShowUnfollowDialog(true) : handleFollow();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFollowing ? (
                <span className="font-semibod text-text-secondary2">
                  Following
                </span>
              ) : (
                <span className="font-semibod">Follow back</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={showUnfollowDialog}
        onOpenChange={setShowUnfollowDialog}
        className="border-solid outline"
      >
        <AlertDialogContent className="w-[280px] h-[206px] p-0 rounded-2xl flex flex-col">
          <div className="flex flex-col items-center p-7 pb-2">
            <Avatar
              image={data.user.image}
              size={64}
              name={data.user.name}
              className="mb-4"
            />
            <p className="text-center text-foreground font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
              Unfollow {data.user.name}?
            </p>
          </div>
          <div className="flex border-t border-border">
            <div
              onClick={() => setShowUnfollowDialog(false)}
              className="flex-1 h-12 flex items-center justify-center cursor-pointer  hover:cursor border-r border-border"
            >
              Cancels
            </div>
            <div
              onClick={handleUnfollow}
              className="flex-1 h-12 flex items-center justify-center cursor-pointer text-destructive font-semibold hover:cursor"
            >
              Unfollow
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
