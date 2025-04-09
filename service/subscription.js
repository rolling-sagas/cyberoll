import Cookies from "js-cookie";
import { getCurrentSubscription, dailyCheck } from "@/service/credits";
import { COOKIE_LOGIN } from "@/utils/credit";

export const WILL_CHANGE_SUBSCRIPTION = 'will_change_subscription';
export const SUBSCRIB_CHECK_INTERVAL = 4 * 1000;

export const EVENT_TYPE = {
  STRIPE_SUBSCRIPTION: 'stripe_subscription',
  STRIPE_CANCEL_SUBSCRIPTION: 'stripe_cancel_subscription',
  GIFT: 'gift',
}

export function markChangeSubscription() {
  Cookies.remove(COOKIE_LOGIN.DAILY_CHECK)
  Cookies.set(WILL_CHANGE_SUBSCRIPTION, 1, {
    expires: 1 / 2 / 24, // 半小时
  })
}

export function willChangeSubscription() {
  return !!Cookies.get(WILL_CHANGE_SUBSCRIPTION)
}

export async function loopIsSubscriptionChanged(plan) {
  if (!plan || !willChangeSubscription()) return false
  const { type: curPlan } = await dailyCheck()
  if (plan !== curPlan) {
    Cookies.remove(WILL_CHANGE_SUBSCRIPTION)
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
