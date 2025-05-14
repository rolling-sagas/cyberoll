// import { NextResponse } from "next/server";
import { SSO_HOST, SSO_TOKEN_KEY } from '@/utils/const';
import ifetch from '@/utils/ifetch';

export const runtime = 'edge';

export async function GET({ url, nextUrl }) {
  const { searchParams, origin } = new URL(url);
  try {
    const token = searchParams.get(SSO_TOKEN_KEY);
    if (!token) throw '[sso] no session-token found';
    const res = await ifetch(SSO_HOST + '/auth/session', {
      headers: {
        Cookie: `session-token=${token};`,
      },
    });
    if (!res.ok) {
      console.error("[sso] can't validate token");
      return new Response('can\'t validate token', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        }})
    }
    const session = await res.json();
    if (!session) {
      console.error("[sso] can't validate token");
      return new Response('can\'t validate token', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        }})
    }

    const expires = new Date(session.expires).toUTCString(); //  确保 expires 是 UTC 格式
    const cookieValue = `${SSO_TOKEN_KEY}=${token}; Path=/; Expires=${expires}; SameSite=Strict`; //  构建 Cookie 字符串

    const next = nextUrl.searchParams.get('next');

    return new Response(null, {
      status: 302,
      headers: {
        'Location': next || origin,
        'Set-Cookie': cookieValue,
      },
    });
  } catch (e) {
    console.error('[sso] error', e);
    // return NextResponse.redirect(origin);
  }
}
