'use client';
export const runtime = 'edge';

// import PinnedColumns from "@/components/columns/pinned-columns";

import { useEffect } from 'react';

import useUserStore from '@/stores/user';
import { getActivities, checkActivityUpdateStatus } from '@/service/activity';

export default function Page() {
  const userInfo = useUserStore((state) => state.userInfo);

  useEffect(() => {
    if (userInfo) {
      const fetchData = async () => {
        const res = await getActivities();
        console.log('res', res);
      };
      fetchData();
    }
  }, [userInfo]);
}
