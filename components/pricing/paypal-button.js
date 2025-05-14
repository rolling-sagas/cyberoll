'use client';

import { changePaypalSubscription, savePaypalSubscription } from '@/service/paypal';
import { markChangeSubscription } from '@/service/subscription';
import useUserStore from '@/stores/user';
import { goSso } from '@/utils/index';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast/headless';

export default function PaypalButton({
  paypal,
  planId,
  children,
  className = '',
  isChangePlan = false,
}) {
  const [inited, setInited] = useState(false);
  const elRef = useRef(null);
  const userInfo = useUserStore((state) => state.userInfo);

  const init = useCallback(() => {
    if (inited || !elRef.current || !paypal || isChangePlan) return;
    setInited(true);
    if (elRef.current.children.length) {
      return;
    }
    paypal
      .Buttons({
        fundingSource: 'paypal',
        createSubscription: function (data, actions) {
          const userInfo = useUserStore.getState().userInfo;
          if (!userInfo?.id) {
            return toast.error('User not login!');
          }
          return actions.subscription.create({
            plan_id: planId,
            custom_id: userInfo?.id,
          });
        },
        onApprove: async function (data, _actions) {
          console.log('Subscription created successfully!', data);
          await savePaypalSubscription(data.subscriptionID);
          toast.success('Success');
          location.reload();
        },
        onError: function (err) {
          console.error('Error creating subscription:', err);
          toast.error(String(err));
        },
      })
      .render(elRef.current);
  }, [elRef, paypal, planId, isChangePlan]);

  const changePlan = useCallback(async () => {
    if (!userInfo) return goSso();
    if (!isChangePlan) return;
    console.log('changePlan', planId);
    const res = await changePaypalSubscription(planId);
    markChangeSubscription();
    location.href = res.approveLink;
  }, [isChangePlan, planId, userInfo]);

  useEffect(() => {
    init();
  }, [elRef, paypal, isChangePlan]);

  return (
    <>
      <div className={`relative ${className}`}>
        <div className="relative z-0 overflow-hidden  rounded-xl">
          <div ref={elRef} className="-ml-72 -mr-72 h-14"></div>
        </div>
        <div
          className={`${
            isChangePlan || !userInfo ? '' : 'pointer-events-none'
          } z-1 absolute left-0 top-0 w-full`}
          onClick={changePlan}
        >
          {children}
        </div>
      </div>
    </>
  );
}
