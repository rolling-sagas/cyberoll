import { createServerEvent } from '@/service/event';

const trackData2EventData = (eventName, eventData = {}) => {
  const data = {
    eventName,
  };
  if (eventData?.utm_source) {
    data.utmSource = eventData?.utm_source;
  }
  if (eventData?.utm_medium) {
    data.utmMedium = eventData?.utm_medium;
  }
  if (eventData?.utm_campaign) {
    data.utmCampaign = eventData.utm_campaign;
  }
  data.extraInfo = JSON.stringify(eventData);
  return data;
};

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const API_SECRET = process.env.NEXT_PUBLIC_FIREBASE_API_SECRET;

export async function logServerEvent({
  client_id,
  event_name,
  event_params = {},
}) {
  try {
    const data = trackData2EventData(event_name, {
      ...event_params,
      client_id,
    });

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
          timestamp_micros: Date.now() * 1000,
        },
      ],
    };

    const [eventResult, gaResult] = await Promise.all([
      createServerEvent([data]),
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    ]);

    console.log([eventResult, gaResult]);

    if (!gaResult.ok) {
      throw new Error(`HTTP error! status: ${gaResult.status}`);
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
