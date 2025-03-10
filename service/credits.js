// this file is used for client
import http from '@/utils/http';

import { API_PAYURL } from '@/utils/const';

// 获取当前用户订阅模式
export async function getCurrentSubscription() {
  const data = await http.get(`${API_PAYURL}/subscription`);
  data.isCancelAtPeriodEnd = data.raw?.cancel_at_period_end || false;
  return data;
}

// 获取用户当前余额
export async function getCurrentCredits() {
  const data = await http.get(`${API_PAYURL}/credits`);
  return data;
}

export async function hasCredits() {
  const { daily = 0, monthly = 0 } = await http.get(`${API_PAYURL}/credits`);
  return daily + monthly > 0
}

// 更新用户额度，包括发放每日免费额度
export async function dailyCheck() {
  const data = await http.get(`${API_PAYURL}/subscription/daily_check`)
  return data;
}
