"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";
import { ArrowLeft02Icon } from "@hugeicons/react";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Thread from "@/components/columns/threads/thread";
import CircleIconButton from "@/components/buttons/circle-icon-button";

export default function Page({ params }) {
  const router = useRouter()

  const id = params.id
  const [thread, setThread] = useState(null)

  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    async function fetchThread() {
      let res = await fetch("/api/session/" + id)
      let data = await res.json()
      setThread(data)
    }

    reset()
    fetchThread(id)
  }, [id])

  useEffect(() => {
    if (!thread) return
    addColumn("thread", {
      headerLeft: <CircleIconButton onClick={() => router.push("/")}
        icon={<ArrowLeft02Icon size={12} />}
      />,
      headerCenter: thread.name,
    }, <Thread data={thread} />);
  }, [addColumn, thread])

  return <PinnedColumns />;
}
