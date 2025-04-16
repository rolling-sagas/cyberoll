'use client';

import { FavouriteIcon } from '@hugeicons/react';
import { Badge } from '@/app/components/ui/badge';
import { useState, useEffect } from 'react';
import { checkActivityUpdateStatus } from '@/service/activity';
import useUserStore from '@/stores/user';
import NavButton from './nav-button';

var statusInterval = null;

export default function ActivityIcon({ l1Pathname }) {
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const userInfo = useUserStore((state) => state.userInfo);

  useEffect(() => {
    if (userInfo) {
      const checkActivity = async () => {
        try {
          const res = await checkActivityUpdateStatus();
          setHasNewActivity(res || false);
          console.log(
            'checkActivity at ',
            new Date().toISOString(),
            'res is: ',
            res
          );
        } catch (error) {
          console.error('Failed to check activity status:', error);
        }
      };
      if (!statusInterval) {
        checkActivity();
        // 每10秒检查一次活动状态
        statusInterval = setInterval(checkActivity, 10000);
      }
    }
  }, [userInfo]);

  return (
    <div className="relative">
      <FavouriteIcon
        strokeWidth="2"
        variant={l1Pathname === '/a' ? 'solid' : 'stroke'}
      />
      {hasNewActivity && l1Pathname !== '/a' && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-2 w-2 p-0"
        />
      )}
    </div>
  );
}
