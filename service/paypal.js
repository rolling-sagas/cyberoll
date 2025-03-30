// this file is used for client
import http from '@/utils/http';
import { API_PAYURL } from '@/utils/const';

export async function savePaypalSubscription(subscriptionID) {
  const data = await http.post(`${API_PAYURL}/subscription/paypal`, {
    subscriptionID,
  });
  return data;
}

export async function changePaypalSubscription(planid) {
  const data = await http.get(`${API_PAYURL}/subscription/paypal/change_plan`, {
    params: {
      planid,
    },
  });
  return data;
}
