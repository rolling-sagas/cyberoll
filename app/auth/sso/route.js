import { redirect } from 'next/navigation';
import ifetch from '@/utils/ifetch';
import { SSO_HOST, SSO_TOKEN_KEY } from '@/utils/const';

export const runtime = 'edge';

export async function GET({ url }) {
  try {
    const { searchParams, origin } = new URL(url);
    const token = searchParams.get(SSO_TOKEN_KEY);
    if (!token) throw '[sso] no session-token found';
    const res = await ifetch(SSO_HOST + '/auth/session', {
      headers: {
        Cookie: `session-token=${token};`,
      },
    });
    if (!res.ok) throw "[sso] can't validate token";
    const session = await res.json();
    if (!session) throw "[sso] can't validate token";

    const expires = new Date(session.expires).toUTCString(); //  确保 expires 是 UTC 格式
    const cookieValue = `${SSO_TOKEN_KEY}=${token}; Path=/; Expires=${expires}; SameSite=Strict`; //  构建 Cookie 字符串

    return new Response(null, {
      status: 302,
      headers: {
        'Location': origin,
        'Set-Cookie': cookieValue,
      },
    });
  } catch (e) {
    return new Response(e.message, {
      status: 200
    })
    console.error('[sso] error', e);
    redirect('/auth');
  }
}
