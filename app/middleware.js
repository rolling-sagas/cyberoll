import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  console.log('[middleware]')
  const res = NextResponse.next();
  res.headers.set('x-url', req.nextUrl.href);
  return res;
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// };
