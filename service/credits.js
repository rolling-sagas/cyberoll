// this file is used for client
import http from '@/utils/http';

// 获取当前用户订阅模式
export async function getCurrentSubscription() {
  const data = await http.get('pay/subscription');
  data.isCancelAtPeriodEnd = data.raw?.cancel_at_period_end || false;
  return data;
}

// 获取用户当前余额
export async function getCurrentCredits() {
  const data = await http.get('pay/credits');
  return data;
}

export async function hasCredits() {
  const { daily = 0, monthly = 0 } = await http.get('pay/credits');
  return daily + monthly > 0
}

// 更新用户额度，包括发放每日免费额度
export async function dailyCheck() {
  const data = await http.post('pay/subscription/daily_check')
  return data;
}
