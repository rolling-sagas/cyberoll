'use-client';

import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import HoverButton from '@/components/buttons/hover-button';
import Avatar from '@/components/common/avatar';
import DropdownBlockItem from '@/components/dropdown/dropdown-block-item';
import { onReportProblem } from '@/components/navbar/report-problem-action';
import UserSkeleton from '@/components/skeleton/user-skeleton';
import { BLOCK_TYPE, deleteBlock } from '@/service/block';
import { getCurrentCredits } from '@/service/credits';
import { FEEDBACK_TYPE } from '@/service/feedback';
import { getFollowers, toggleFollowUser } from '@/service/relation';
import { getUserInfo } from '@/service/user';
import useUserStore from '@/stores/user';
import {
  AlertSquareIcon,
  CrownIcon,
  MoreHorizontalCircle02Icon,
} from '@hugeicons/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast/headless';
import UserTabs from './user-tabs';

export default function User({ uid }) {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const currentUser = useUserStore((state) => state.userInfo);
  const subscription = useUserStore((state) => state.subscription);
  const [credits, setCredits] = useState(0);

  const isSelf = !uid || uid === '_' || uid === currentUser?.id;

  useEffect(() => {
    const fetchData = async () => {
      const credits = await getCurrentCredits();
      // console.log('credits', credits);
      let data = credits.daily + credits.monthly;
      if (credits.unlimited) {
        data = 'unlimited';
      }
      setCredits(data);
    };
    if (isSelf) {
      fetchData();
    }
  }, [isSelf]);

  const fetchUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const info = await getUserInfo(uid);
      setUser(info);
    } finally {
      setUserLoading(false);
    }
  }, [uid]);

  const fetchFollwers = useCallback(async () => {
    try {
      const data = await getFollowers(0, 3, uid);
      setFollowers(data.followers);
      setFollowerCount(data.total);
    } catch (e) {
      console.error(e);
    }
  }, [uid]);

  const toggleFollow = async (isFollow = true) => {
    if (isSelf || userLoading || following) return;
    try {
      setFollowing(true);
      setUser({
        ...user,
        followedByMe: isFollow,
      });
      await toggleFollowUser(user.id, isFollow);
      fetchFollwers();
    } catch (e) {
      setUser({
        ...user,
      });
    } finally {
      setFollowing(false);
    }
  };

  const unblockUser = async () => {
    try {
      await deleteBlock(user?.blockId);
      toast.success('Unblock Success');
      setUser({ ...user, blockId: '' });
    } catch (e) {
      toast.error('Unblock failed');
    }
  };

  const initPageFetch = () => {
    fetchFollwers();
    fetchUser();
  };

  useEffect(() => {
    initPageFetch();
  }, [uid]);

  return (
    <div className="flex h-full px-6 py-4 w-full flex-col gap-4">
      {userLoading ? (
        <UserSkeleton />
      ) : (
        <div className="flex w-full justify-between">
          <div>
            <span className="text-foreground text-lg font-bold flex gap-1 items-center">
              {user?.name}
              {subscription?.type !== 'free' ? (
                <CrownIcon
                  size={18}
                  strokeWidth="2"
                  className="!text-amber-500"
                  variant="duotone"
                />
              ) : null}
            </span>
            <span className="whitespace-pre">{user?.description}</span>
          </div>
          <Avatar image={user?.image} size={64} name={user?.name} uid={uid} />
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex">
            {followers.map((f) => (
              <Avatar
                key={f.id}
                image={f?.follower.image}
                size={24}
                name={f?.follower.name}
                className="-mr-2 last:mr-1"
              />
            ))}
          </div>
          <span className="text-gray-400 text-sm">
            {followerCount} follower{followerCount > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          {isSelf ? (
            <Button className="h-6 px-2" size="sm" variant="outline">
              {credits} credits
            </Button>
          ) : null}
          {user?.id && !isSelf && (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none big-size-trigger">
                <HoverButton className="-mr-[9px]">
                  <MoreHorizontalCircle02Icon size={24} strokeWidth="2" />
                </HoverButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-2 w-52">
                <DropdownBlockItem
                  type={BLOCK_TYPE.USER}
                  basicData={{
                    targetUserId: user.id,
                  }}
                  title={`Block ${user?.name}?`}
                  targetName={user?.name}
                  onSuccessCallback={initPageFetch}
                  blockId={user?.blockId} // TODO: 确认是否为这个字段
                />
                <DropdownMenuItem
                  className="h-11 rounded-xl px-3 text-base font-semibold"
                  onClick={() =>
                    onReportProblem({
                      title: 'Report User',
                      type: FEEDBACK_TYPE.USER,
                      data: {
                        targetUserId: user.id,
                      },
                    })
                  }
                >
                  <div className="flex gap-10 justify-between w-full cursor-pointer font-semibold text-red-500">
                    Report
                    <AlertSquareIcon size={20} />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {isSelf ? (
        <div className="flex gap-4">
          <Link href="/u/_/edit" className="w-full">
            <Button variant="outline" className="w-full">
              Edit profile
            </Button>
          </Link>
          <Link href="/plan" className="w-full">
            <Button variant="outline" className="w-full">
              <CrownIcon
                strokeWidth="2"
                className={
                  subscription?.type === 'free'
                    ? 'text-rs-text-secondary'
                    : '!text-amber-500'
                }
                variant="duotone"
              />
              My plan
            </Button>
          </Link>
        </div>
      ) : null}
      {user?.blockId ? (
        <Button variant="outline" className="rounded-xl" onClick={unblockUser}>
          Unblock
        </Button>
      ) : !isSelf ? (
        user?.followedByMe ? (
          <Button
            className="rounded-xl"
            onClick={() => toggleFollow(false)}
            variant="outline"
          >
            Following
          </Button>
        ) : (
          <Button className="rounded-xl" onClick={toggleFollow}>
            Follow
          </Button>
        )
      ) : null}
      <UserTabs uid={uid} isSelf={isSelf} />
    </div>
  );
}
