"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";
import { ArrowLeft02Icon } from "@hugeicons/react";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Chapters from "@/components/columns/chapters/chapters";
import CircleIconButton from "@/components/buttons/circle-icon-button";
import Story from "@/components/columns/stories/story";

export default function Page({ params }) {
  const router = useRouter()

  const id = params.id
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("Story", {
      headerLeft: <CircleIconButton onClick={() => router.push("/")}
        icon={<ArrowLeft02Icon size={12} />}
      />,
      headerCenter: "Story",
    }, <Story storyId={id}/>);
    addColumn("chapters", {
      headerCenter: "Chapters",
    }, <Chapters storyId={id} />);
  })

  return <PinnedColumns />;
}
