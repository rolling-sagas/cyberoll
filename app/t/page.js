export const runtime = 'edge';

import Link from "next/link";

export const metadata = {
  title: 'rollingsagas 1',
  generator: 'Next.js 2',
  applicationName: 'Next.js 3',
  keywords: ['Next.js', 'React', '22'],
  description: 'sss',
}

export default async function Page({searchParams}) {
  const params = new URLSearchParams(searchParams);
  params.set('count', + (searchParams.count || 1) + 1);
  await fetch('https://www.baidu.com')

  return <Link href={`?${params.toString()}`}>xxxxxx</Link>
}
