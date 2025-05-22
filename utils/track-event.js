import { analytics, logEvent } from '@/components/firbase/firebase-init';

// rs_first_view call this function
// TODO: add server
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

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const API_SECRET = process.env.NEXT_PUBLIC_FIREBASE_API_SECRET;

export async function logServerEvent({
  client_id,
  event_name,
  event_params = {},
}) {
  try {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;

    const payload = {
      client_id,
      events: [
        {
          name: event_name,
          params: {
            ...event_params,
            engagement_time_msec: 100,
          },
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Server event tracked successfully:', event_name);
    return true;
  } catch (error) {
    console.error('❌ Server event tracking failed:', {
      event_name,
      error: error.message,
    });
    return false;
  }
}
