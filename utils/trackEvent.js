import { analytics, logEvent } from '@/components/firbase/firebase-init';

// 事件追踪方法
export function trackEvent(eventName, eventData = {}) {
  // TODO: 实现具体的事件追踪逻辑
  console.log('Track Event:', eventName, eventData);

  // 这里可以集成具体的事件追踪服务
  // 例如：Google Analytics, Mixpanel, Amplitude 等
}

export function clientTrackEvent(eventName, eventData = {}) {
  try {
    console.log('in', analytics);
    if (!analytics) {
      throw new Error('Firebase Analytics not initialized');
    }

    logEvent(analytics, eventName, {
      ...eventData,
      client_timestamp: new Date().toISOString(),
    });

    console.log('✅ Event tracked successfully:', eventName);
  } catch (e) {
    console.error('❌ Event tracking failed:', {
      eventName,
      error: e.message,
    });
  }
}
