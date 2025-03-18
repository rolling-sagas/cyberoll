import { SSO_HOST } from './const'

export function goSso() {
  location.href = SSO_HOST + 
  '/auth/signin?callbackUrl=' +
  encodeURIComponent(window.location.origin + '/auth/sso');
}

export function goLogout() {
  location.href = SSO_HOST + 
  '/auth/signout?callbackUrl=' +
  encodeURIComponent(window.location.origin);
}
