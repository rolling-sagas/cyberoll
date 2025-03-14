"use client"

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";

import PublicStories from "@/components/columns/stories/public-stories";

export default function Page() {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("publicStories", { headerCenter: <div>Stories</div> }, <PublicStories />);
  }, [addColumn])

  return <PinnedColumns />;
}
