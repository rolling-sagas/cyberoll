'use client';

import { Badge } from '@/app/components/ui/badge';
import { checkActivityUpdateStatus } from '@/service/activity';
import useUserStore from '@/stores/user';
import { FavouriteIcon } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';

export default function ActivityIcon({ l1Pathname }) {
  const [hasNewActivity, setHasNewActivity] = useState(false);
  const userInfo = useUserStore((state) => state.userInfo);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      const checkActivity = async () => {
        try {
          const res = await checkActivityUpdateStatus();
          setHasNewActivity(res || false);
        } catch (error) {
          console.error('Failed to check activity status:', error);
        }
      };

      // 立即执行一次检查
      checkActivity();

      // 每10秒检查一次活动状态
      intervalRef.current = setInterval(checkActivity, 10000);

      // 组件卸载时清理定时器
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [userInfo]);

  // 当用户访问活动页面时，清除红点提示
  useEffect(() => {
    if (l1Pathname === 'a') {
      setHasNewActivity(false);
    }
  }, [l1Pathname]);

  return (
    <div className="relative">
      <FavouriteIcon
        strokeWidth="2"
        variant={l1Pathname === 'a' ? 'solid' : 'stroke'}
      />
      {hasNewActivity && l1Pathname !== 'a' && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-2 w-2 p-0"
        />
      )}
    </div>
  );
}
