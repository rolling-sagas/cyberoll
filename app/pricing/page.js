"use client"
export const runtime = 'edge';

import { useEffect, useState } from "react";
import PriceSubscription from "@/components/pricing/price-subscription";
import { PLAN } from '@/utils/credit';
import { getCurrentSubscription, getCurrentCredits } from '@/service/credits';

export default function Page() {
  const [currentSubscription, setCurrentSubscription] = useState({
    plan: PLAN.FREE,
  });
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true)
      try {
        const [subscription, credits] = await Promise.all([
          getCurrentSubscription(),
          getCurrentCredits(),
        ]);
        console.log('subscription', subscription);
        console.log('credits', credits);
        setCurrentSubscription(subscription);
      } finally {
        setIsloading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full">
      <section className="flex h-full min-w-0 flex-1 flex-col items-center justify-start p-8 overflow-y-auto scrollbar-none">
        <div className="mb-[34px] flex flex-col items-center justify-center gap-3 2xl:mt-10">
          <h1 className="font-medium tracking-[0.0225rem] text-foreground text-4xl lg:text-7xl">
            Upgrade your plan
          </h1>
        </div>
        <PriceSubscription
          subscription={currentSubscription}
        />
      </section>
    </div>
  );
}
