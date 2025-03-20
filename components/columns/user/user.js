'use-client';

import { useState, useEffect, useCallback } from 'react';
import { getUserInfo } from '@/service/user';
import UserSkeleton from '@/components/skeleton/user-skeleton';
import { Button } from '@/app/components/ui/button';
import { CrownIcon } from '@hugeicons/react';
import { toggleFollowUser, getFollowers } from '@/service/relation';
import UserTabs from './user-tabs';
import Link from 'next/link';
import useUserStore from '@/stores/user';
import { getCurrentCredits } from '@/service/credits';
import Avatar from '@/components/common/avatar';

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
      console.log('credits', credits);
      let data = credits.daily + credits.monthly;
      if (credits.daily === 'unlimited' || credits.monthly === 'unlimited') {
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

  useEffect(() => {
    fetchFollwers();
    fetchUser();
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
          <Avatar image={user?.image} size={64} name={user?.name} />
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="flex">
            {followers.map((f) => (
              <Avatar key={f.id} image={f?.follower.image} size={24} name={f?.follower.name} className="-mr-2 last:mr-1"/>
            ))}
          </div>
          <span className="text-gray-400 text-sm">
            {followerCount} followers
          </span>
        </div>
        <Button className="h-6 px-2" size="sm" variant="outline">
          {credits} credits
        </Button>
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
      {!isSelf ? (
        user?.followedByMe ? (
          <Button onClick={() => toggleFollow(false)} variant="outline">
            Following
          </Button>
        ) : (
          <Button onClick={toggleFollow}>Follow</Button>
        )
      ) : null}
      <UserTabs uid={uid} isSelf={isSelf} />
    </div>
  );
}
