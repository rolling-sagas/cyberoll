'use client';

import Script from 'next/script';
import useUserStore from '@/stores/user';
import toast from 'react-hot-toast/headless';
import { savePaypalSubscription } from '@/service/paypal';
import { useEffect, useCallback, useState, useRef } from 'react';

export default function Page() {
  const [inited, setInited] = useState(false);
  const elRef = useRef(null);

  const onload = useCallback(async () => {
    if (inited || !elRef.current || !window.paypal) return;
    setInited(true);
    if (elRef.current.children.length) {
      return;
    }
    await window.paypal
      .Buttons({
        style: {
          backgroundColor: 'red',
        },
        fundingSource: 'paypal',
        createSubscription: function (data, actions) {
          const userInfo = useUserStore.getState().userInfo;
          if (!userInfo?.id) {
            return toast.error('User not login!');
          }
          return actions.subscription.create({
            plan_id: 'P-04Y33010S00596318M7TXPBI',
            custom_id: userInfo?.id,
          });
        },
        onApprove: async function (data, actions) {
          console.log('Subscription created successfully!', data);
          await savePaypalSubscription(data.subscriptionID);
        },
        onError: function (err) {
          console.error('Error creating subscription:', err);
          toast.error(String(err));
        },
      })
      .render(elRef.current);
  }, [elRef]);

  useEffect(() => {
    console.log(111);
    onload();
  }, [elRef]);

  return (
    <>
      <Script
        onLoad={onload}
        src="https://www.paypal.com/sdk/js?client-id=AagDFfkVuL3_R8sls5sM22RN2XLASBmKPQa7id-lv5P_B-4DZQNZpLlEWU9S38ALR7VP3ltSegpA1hFG&vault=true&intent=subscription&components=buttons"
      />
      <div ref={elRef} className="p-8"></div>
    </>
  );
}
