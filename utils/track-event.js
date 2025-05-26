import { analytics, logEvent } from '@/components/firbase/firebase-init';
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
  data.extraInfo = JSON.stringify({ ...eventData, dataFrom: 'cyberoll' });
  return data;
};

// rs_first_view call this function
// TODO: add server
export async function clientTrackEvent(eventName, eventData = {}) {
  try {
    const data = trackData2EventData(eventName, eventData);
    console.log(eventName, data);
    const ret = await Promise.all([
      createServerEvent([data]),
      logEvent(analytics, eventName, {
        ...{ ...eventData, source_from: 'cyberoll' },
        client_timestamp: new Date().toISOString(),
      }),
    ]);
    console.log({ ret });
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
        },
      ],
    };

    const ret = await Promise.all([
      createServerEvent([data]),
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    ]);
    console.log({ ret });

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
