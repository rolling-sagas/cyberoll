'use client';

import Script from "next/script"
import useUserStore from "@/stores/user";
import toast from "react-hot-toast/headless";
import { savePaypalSubscription } from "@/service/paypal";

export default function Page(){
  return (
    <>
      <Script onLoad={() => {
        paypal.Buttons({
          createSubscription: function(data, actions) {
            const userInfo = useUserStore.getState().userInfo
            if (!userInfo?.id) {
              return toast.error('User not login!');
            }
            return actions.subscription.create({
              plan_id: 'P-09B54496GD2990949M7QO7TQ',
              custom_id: userInfo?.id,
            });
          },
          onApprove: async function(data, actions) {
            console.log('Subscription created successfully!', data);
            await savePaypalSubscription(data.subscriptionID)
          },
          onError: function(err) {
            console.error('Error creating subscription:', err);
            toast.error(String(err))
          }
        }).render('#paypal-btn');
      }} src="https://www.paypal.com/sdk/js?client-id=AagDFfkVuL3_R8sls5sM22RN2XLASBmKPQa7id-lv5P_B-4DZQNZpLlEWU9S38ALR7VP3ltSegpA1hFG&vault=true&intent=subscription" />
      <div className="p-8" id="paypal-btn"></div>
    </>
  )
}
