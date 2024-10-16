"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";
import { ArrowLeft02Icon } from "@hugeicons/react";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Chapter from "@/components/columns/chapters/chapter";
import CircleIconButton from "@/components/buttons/circle-icon-button";

export default function Page({ params }) {
  const router = useRouter()

  const id = params.id
  const [chapter, setChapter] = useState(null)

  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    async function fetchChapter() {
      let res = await fetch("/api/chapter/" + id)
      let data = await res.json()
      setChapter(data)
    }

    reset()
    fetchChapter(id)
  }, [id])

  useEffect(() => {
    if (!chapter) return
    addColumn("chapter", {
      headerLeft: <CircleIconButton onClick={() => router.push("/")}
        icon={<ArrowLeft02Icon size={12} />}
      />,
      headerCenter: chapter.name,
    }, <Chapter data={chapter} />);
  }, [addColumn, chapter])

  return <PinnedColumns />;
}
