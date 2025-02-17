import { SSO_HOST } from "./const";

export function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

export function goSso() {
  location.href = SSO_HOST + 
  '/auth/signin?callbackUrl=' +
  encodeURIComponent(window.location.origin + '/auth/sso');
}
