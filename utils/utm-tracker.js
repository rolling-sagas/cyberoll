'use client';

import { clientTrackEvent } from '@/utils/track-event';
import { getUtmParams, storeUtmParams } from '@/utils/utm';

export async function utmTrack() {
  try {
    const utmParams = getUtmParams();
    console.log('1. utmParams', utmParams);
    if (Object.keys(utmParams).length > 0) {
      storeUtmParams(utmParams);
      // removeUtmParams();
      console.log('set localstorage ok');
      await clientTrackEvent('rs_first_view', utmParams);
    }
  } catch (error) {
    console.log('utm track failed: ', error);
  }
}
