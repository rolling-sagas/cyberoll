import Cookies from 'js-cookie';
import { SSO_HOST } from './const';
import { getAndRemoveUtmParams } from './utm';

export function goSso() {
  const next = encodeURIComponent(location.href);
  const adSource = getAndRemoveUtmParams();

  let callbackUrl = window.location.origin + '/auth/sso?next=' + next;

  // 如果有广告来源参数，添加到回调 URL
  if (adSource) {
    const adSourceStr = encodeURIComponent(JSON.stringify(adSource));
    callbackUrl += `&ad_source=${adSourceStr}`;
  }

  location.href =
    SSO_HOST + '/auth/signin?callbackUrl=' + encodeURIComponent(callbackUrl);
}

export function goLogout() {
  Cookies.remove('session-token');
  goSso();
}
