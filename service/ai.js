// this file is used for client
import Cookies from 'js-cookie';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASEURL

// ai
export async function azure(content) {
  const response = await fetch(`${BASE_URL}ai/azure`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`
    },
    body: JSON.stringify({
      messages: content.map(m => ({
        role: m.role, content: m.content
      })),
      stream: true,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response
}
