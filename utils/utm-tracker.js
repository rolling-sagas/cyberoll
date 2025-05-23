'use client';

import { clientTrackEvent } from '@/utils/track-event';
import { getUtmParams, removeUtmParams, storeUtmParams } from '@/utils/utm';

export async function utmTrack() {
  try {
    const utmParams = getUtmParams();
    const eventName = 'rs_first_view';
    const hasViewed = localStorage.getItem(eventName);
    if (hasViewed) {
      removeUtmParams();
      return;
    }
    if (Object.keys(utmParams).length > 0) {
      storeUtmParams(utmParams);
      removeUtmParams();

      await clientTrackEvent(eventName, utmParams);
      localStorage.setItem(eventName, String(new Date()));
    }
  } catch (error) {
    console.log('utm track failed: ', error);
  }
}
