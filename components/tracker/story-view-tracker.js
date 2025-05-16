'use client';

import { analytics, logEvent } from '@/components/firbase/firebase-init';
import useUserStore from '@/stores/user';
import { useEffect } from 'react';

export default function StoryViewTracker({ story }) {
  const userInfo = useUserStore((state) => state.userInfo);

  useEffect(() => {
    if (!analytics || !story) return;

    try {
      logEvent(analytics, 'story_view', {
        user_id: userInfo?.id || '',
        user_name: userInfo?.name || '',
        user_email: userInfo?.email || '',
        story_id: story?.id || '',
        story_name: story?.name || '',
        story_location: window.location.href || '',
      });
    } catch (e) {
      console.error('logEvent error:', e);
    }
  }, [story]);

  return null; // 不渲染任何内容，只是触发埋点
}
