import { Button } from '@/app/components/ui/button';
import Avatar from '@/components/common/avatar';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { toggleFollowUser } from '@/service/relation';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast/headless';

const mockData = {
  user: {
    id: 'cm42e1xom0000hl7qlk6ivc5f',
    name: 'xiao',
    image: '6cf470c7-1ffa-4d18-02cb-1c536436f400',
    followers: [],
  },
  targetUser: {
    id: 'cm9gtdx5t0000jyxr7tjs2ldf',
    name: 'Alucard',
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocIefMqmVRLlbVcm57hz6F0VYyerq4d3xPnTKvOBAmBA1yKdw9lZ=s96-c',
  },
  comment: null,
  story: null,
  type: 'social',
  subType: 'follow',
  createdAt: '2025-04-16T08:23:36.383Z',
};

export function ActivityColumnFollowItem({ data }) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showUnfollowDialog, setShowUnfollowDialog] = useState(false);

  useEffect(() => {
    const ret = data.user.followers.some(
      (item) => item.followerId === data.targetUser.id
    );
    console.log(
      'me',
      data.targetUser.id,
      'source followers',
      data.user.followers,
      'ret',
      ret
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

  return (
    <>
      <div className="px-6 py-4 border-gray-200 bg-background  hover:bg-rs-background-hover">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-3 items-center">
            <Avatar image={data.user.image} size={36} name={data.user.name} />
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
              // size="sm"
              className={`min-w-[100px] rounded-[10px] ${
                isFollowing
                  ? 'hover:bg-backgroundhover border-1 text-zinc-400 hover:text-zinc-400'
                  : ''
              }`}
              onClick={() => {
                if (isFollowing) {
                  setShowUnfollowDialog(true);
                } else {
                  handleFollow();
                }
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
              Cancel
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
