'use server';

import { cookies } from 'next/headers';
const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;
import NotFound from '@/app/not-found';
import Error from '@/components/common/error';
import NotLogin from '@/components/common/not-login';

export default async function ifetch(url, options = {}) {
  try {
    if (!url.startsWith('http')) {
      url = baseURL + url;
    }
    const token = cookies().get('session-token')?.value || '';
    const headers = options.headers || {};
    headers['Session-Token'] = token;
    options.headers = headers;

    const res = await fetch(url, options);

    if (res.ok) {
      return [null, await res.json()];
    } else {
      // await bi.error({
      //   status: res.status,
      //   error: res.statusText,
      //   url,
      //   options,
      // })
      console.error(`[ifetch error]: ${res.statusText}`);
      const status = res.status;
      if (status === 404) return [<NotFound />];
      if (status === 401) return [<NotLogin />];
      return [<Error />];
    }
  } catch (e) {
    console.error(`[ifetch error]: ${e?.message || e}`);
    return [<Error />];
  }
}
