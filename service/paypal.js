// this file is used for client
import http from '@/utils/http';
import { API_PAYURL } from '@/utils/const';

export async function savePaypalSubscription(subscriptionID) {
  // 创建 Customer Portal 会话
  const data = await http.post(`${API_PAYURL}/subscription/paypal`, {
    subscriptionID,
  });
  return data;
}
