'use client';
export const runtime = 'edge';

import { useEffect, useState } from 'react';
import PriceSubscription from '@/components/pricing/price-subscription';
import { PLAN } from '@/utils/credit';
import { getCurrentSubscription } from '@/service/credits';
import useUserStore from '@/stores/user';

export default function Page() {
  const [currentSubscription, setCurrentSubscription] = useState({
    plan: PLAN.FREE,
  });
  const [isLoading, setIsloading] = useState(true);
  const userInfo = useUserStore((state) => state.userInfo)

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      try {
        const subscription = await getCurrentSubscription();
        console.log('subscription', subscription);
        setCurrentSubscription(subscription);
      } finally {
        setIsloading(false);
      }
    };
    if (userInfo) fetchData();
  }, [userInfo]);

  return (
    <div className="w-full h-full py-4 2xl:py-10">
      <section className="flex h-full min-w-0 flex-1 flex-col items-center justify-start overflow-y-auto scrollbar-none">
        <div className="mb-[34px] flex flex-col items-center justify-center gap-3">
          <h1 className="font-medium tracking-[0.0225rem] text-foreground text-3xl lg:text-5xl">
            Upgrade your plan
          </h1>
        </div>
        <PriceSubscription subscription={currentSubscription} />
      </section>
    </div>
  );
}
