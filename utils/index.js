import { SSO_HOST } from './const'

export function goSso() {
  location.href = SSO_HOST + 
  '/auth/signin?callbackUrl=' +
  encodeURIComponent(window.location.origin + '/auth/sso');
}