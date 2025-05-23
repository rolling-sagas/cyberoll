// import { NextResponse } from "next/server";
import { SSO_HOST, SSO_TOKEN_KEY } from '@/utils/const';
import ifetch from '@/utils/ifetch';
import { logServerEvent } from '@/utils/log-server-event';

export const runtime = 'edge';

export async function GET({ url, nextUrl }) {
  const { searchParams, origin } = new URL(url);
  try {
    const token = searchParams.get(SSO_TOKEN_KEY);
    if (!token) throw '[sso] no session-token found';

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
    try {
      // 获取广告来源参数
      const utmParams = {};
      for (const [key, value] of searchParams.entries()) {
        if (key.startsWith('utm_')) {
          utmParams[key] = value;
        }
      }
      const adSourceStr = searchParams.get('ad_source');
      let adSource = {};
      if (adSourceStr) {
        try {
          adSource = JSON.parse(decodeURIComponent(adSourceStr));
        } catch (e) {
          console.error('[sso] failed to parse ad_source', e);
        }
      }
      await logServerEvent({
        client_id: `cyberoll-dev-${Date.now()}`,
        event_name: 'rs_sign_in',
        event_params: {
          user_id: session.user?.id,
          email: session.user?.email,
          ...adSource,
        },
      });

      // 判断是否是注册事件
      if (session?.createdAt) {
        const createTime = new Date(session.createdAt);
        const currentTime = new Date();
        const timeDiff = currentTime.getTime() - createTime.getTime();
        const twoMinutes = 2 * 60 * 1000; // 2分钟的毫秒数

        if (timeDiff <= twoMinutes) {
          // 如果是新注册用户（2分钟内创建的账号）
          await logServerEvent({
            client_id: `cyberoll-dev-${Date.now()}`,
            event_name: 'rs_sign_up',
            event_params: {
              user_id: session.user?.id,
              email: session.user?.email,
              ...adSource,
            },
          });
        }
      }
    } catch (error) {
      console.error('failed to log sign event:', error);
    }

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
