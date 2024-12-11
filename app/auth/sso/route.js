import { redirect } from 'next/navigation';
import ifetch from '@/utils/ifetch';
import { NextResponse } from 'next/server';
import { SSO_HOST, SSO_TOKEN_KEY } from '@/utils/const';


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
    const response = NextResponse.redirect(origin);
    response.cookies.set(SSO_TOKEN_KEY, token, {
      expires: new Date(session.expires),
    });
    return response;
  } catch (e) {
    console.error('[sso] error', e);
    redirect('/auth');
  }
}
