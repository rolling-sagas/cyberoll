import Cookies from "js-cookie";
import { getCurrentSubscription, dailyCheck } from "@/service/credits";
import { COOKIE_LOGIN } from "@/utils/credit";

export const HAS_OPENED_STRIPE = 'has_opened_stripe';
export const SUBSCRIB_CHECK_INTERVAL = 4 * 1000;

export const EVENT_TYPE = {
  STRIPE_SUBSCRIPTION: 'stripe_subscription',
  STRIPE_CANCEL_SUBSCRIPTION: 'stripe_cancel_subscription',
  GIFT: 'gift',
}

export function markOpenedStripe() {
  Cookies.remove(COOKIE_LOGIN.DAILY_CHECK)
  Cookies.set(HAS_OPENED_STRIPE, 1, {
    expires: 1 / 2 / 24, // 半小时
  })
}

export function hasOpenedStripe() {
  return !!Cookies.get(HAS_OPENED_STRIPE)
}

export async function loopIsSubscriptionChanged(plan) {
  if (!plan || !hasOpenedStripe()) return false
  const { type: curPlan } = await dailyCheck()
  if (plan !== curPlan) {
    Cookies.remove(HAS_OPENED_STRIPE)
    return true
  } else {
    return new Promise(resolve => {
      setTimeout(async () => resolve(await loopIsSubscriptionChanged(plan)), SUBSCRIB_CHECK_INTERVAL)
    })
  }
}

export async function isSubscriptionChanged() {
  try {
    const { plan } = await getCurrentSubscription();
    return await loopIsSubscriptionChanged(plan)
  } catch(e) {
    console.error('[isSubscriptionChanged error]', e)
    return false
  }
}
