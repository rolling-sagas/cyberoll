// import { NextResponse } from "next/server";
import { SSO_HOST, SSO_TOKEN_KEY } from '@/utils/const';
import ifetch from '@/utils/ifetch';
import { logServerEvent } from '@/utils/track-event';

export const runtime = 'edge';

export async function GET({ url, nextUrl }) {
  const { searchParams, origin } = new URL(url);
  console.log('GET request received', url);
  try {
    const token = searchParams.get(SSO_TOKEN_KEY);
    if (!token) throw '[sso] no session-token found';

    // 获取广告来源参数
    const adSourceStr = searchParams.get('ad_source');
    console.log('adSourceStr', adSourceStr);
    let adSource = null;
    if (adSourceStr) {
      try {
        adSource = JSON.parse(decodeURIComponent(adSourceStr));
        console.log('adSource', adSource);
      } catch (e) {
        console.error('[sso] failed to parse ad_source', e);
      }
    }

    const [err, session] = await ifetch(SSO_HOST + '/auth/session', {
      headers: {
        Cookie: `session-token=${token};`,
      },
    });

    if (err || !session) {
      console.error("[sso] can't validate token");
      return new Response("can't validate token", {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // 发送登录成功事件
    await logServerEvent({
      client_id: `cyberoll-dev-${Date.now()}`,
      event_name: 'rs_sign_in',
      event_params: {
        user_id: session.user?.id,
        email: session.user?.email,
        adSource,
      },
    });

    const expires = new Date(session.expires).toUTCString();
    const cookieValue = `${SSO_TOKEN_KEY}=${token}; Path=/; Expires=${expires}; SameSite=Strict`;

    const next = nextUrl.searchParams.get('next');

    return new Response(null, {
      status: 302,
      headers: {
        Location: next || origin,
        'Set-Cookie': cookieValue,
      },
    });
  } catch (e) {
    console.error('[sso] error', e);
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
