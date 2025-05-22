'use client';

import { clientTrackEvent } from '@/utils/trackEvent';
import { getUtmParams, storeUtmParams } from '@/utils/utm';

export function utmTrack() {
  try {
    const utmParams = getUtmParams();
    console.log('1. utmParams', utmParams);
    if (Object.keys(utmParams).length > 0) {
      storeUtmParams(utmParams);
      console.log('set localstorage ok');
      clientTrackEvent('rs_fist_view', utmParams);
    }
  } catch (error) {
    console.log('utm track failed: ', error);
  }
}
