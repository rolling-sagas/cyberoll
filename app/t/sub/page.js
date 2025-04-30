export const runtime = 'edge';

import Link from "next/link";

export default function Page({searchParams}) {
  const params = new URLSearchParams(searchParams);
  params.set('count', + (searchParams.count || 1) + 1);

  return <Link href={`?${params.toString()}`}>xxxxxx</Link>
}
