import { SSO_HOST } from './const'
import Cookies from 'js-cookie';

export function goSso() {
  const next = encodeURIComponent(location.href);
  location.href = SSO_HOST + 
  '/auth/signin?callbackUrl=' +
  encodeURIComponent(window.location.origin + '/auth/sso?next=' + next);
}

export function goLogout() {
  Cookies.remove('session-token');
  goSso()
}
