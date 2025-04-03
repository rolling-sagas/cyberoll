// this file is used for client
import http from '@/utils/http';
import { markChangeSubscription } from './subscription';
import { API_PAYURL } from '@/utils/const';

export async function createOrGetStripeCustomer() {
  const res = await http.post(
    `${API_PAYURL}/customer/stripe`
  );
  return res?.id;
}

export async function createCheckoutSession(priceId) {
  const customer = await createOrGetStripeCustomer();
  const urlParams = new URLSearchParams(window.location.search);
  const from = urlParams.get('from');
  const { origin } = location;
  const data = await http.post(`${API_PAYURL}/customer/stripe/checkout`, {
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: from ? `${origin}${from}` : `${origin}/?success=true`,
    cancel_url: from ? `${origin}${from}` : `${origin}/?canceled=true`,
    billing_address_collection: 'required',
    locale: 'en',
    customer,
  });
  if (data.url) {
    markChangeSubscription();
    location.href = data.url;
  }
}

export async function createCustomerPortalSession(returnUrl) {
  const cid = await createOrGetStripeCustomer();
  // 创建 Customer Portal 会话
  const data = await http.post(`${API_PAYURL}/customer/stripe/billing`, {
    customer: cid,
    return_url: returnUrl, // 用户管理完成后返回的 URL
  });

  if (data.url) {
    markChangeSubscription();
    return data.url;
  }
}

export async function getPricesByProductId(productId) {
  const { data } = await http.get(`${API_PAYURL}/customer/stripe/prices/${productId}`, {
    params: {
      active: true, // 可选：只查询激活状态的价格
    },
  });
  return data.map(price => ({
    priceId: price.id,
    currency: price.currency,
    unitAmount: price.unit_amount,
    recurring: price.recurring ? price.recurring.interval : null // 订阅周期
  }));
}

export async function updateSubscription() {
  
}
