'use server';

import { redirect } from 'next/navigation';
// import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
const baseURL = process.env.NEXT_PUBLIC_API_BASEURL;

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

    // if (res.status === 401) {
    //   redirect('/login'); // 自动跳转前端到登录页
    // }

    if (res.ok) {
      return await res.json()
    } else {
      // await bi.error({
      //   status: res.status,
      //   error: res.statusText,
      //   url,
      //   options,
      // })
      console.error(`[ifetch error]: ${res.statusText}`)
      throw res.statusText
    }
  } catch (e) {
    console.error(`[ifetch error]: ${e?.message || e}`);
    throw e.message;
  }
}
