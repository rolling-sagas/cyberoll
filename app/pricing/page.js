'use client';
export const runtime = 'edge';

import PriceSubscription from '@/components/pricing/price-subscription-paypal';
import { getCurrentSubscription } from '@/service/credits';
import { featureCtrl } from '@/stores/ctrl';
import useUserStore from '@/stores/user';
import { PLAN } from '@/utils/credit';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function Page() {
  const [currentSubscription, setCurrentSubscription] = useState({
    plan: PLAN.FREE,
  });
  const [_isLoading, setIsloading] = useState(true);
  const userInfo = useUserStore((state) => state.userInfo);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      try {
        const subscription = await getCurrentSubscription();
        // console.log('subscription', subscription);
        setCurrentSubscription(subscription);
      } finally {
        setIsloading(false);
      }
    };
    if (userInfo) fetchData();
  }, [userInfo]);

  if (!featureCtrl.enablePricing) {
    // 跳转到首页
    router.push('/');
  }

  if (!featureCtrl.enablePricing) {
    return (
      <div className="w-full h-full py-4 2xl:py-10">
        <section className="flex h-full min-w-0 flex-1 flex-col items-center justify-start overflow-y-auto scrollbar-none">
          <div className="mb-[34px] flex flex-col items-center justify-center gap-3">
            <h1 className="font-medium tracking-[0.0225rem] text-foreground text-xl lg:text-5xl">
              Pricing is not enabled
            </h1>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-4 2xl:py-10 px-5">
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
