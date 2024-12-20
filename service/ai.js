// this file is used for client
import Cookies from 'js-cookie';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL;

// ai
export async function azure(messages, skipCache) {
  const response = await fetch(`${BASE_URL}/ai/azure`, {
    method: 'POST',
    headers: {
      'Session-Token': Cookies.get('session-token'),
    },
    body: JSON.stringify({
      messages,
      stream: true,
      skip_cache: skipCache,
      type: 'json',
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
