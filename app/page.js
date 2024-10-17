"use client"

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";

import Stories from "@/components/columns/stories/stories";

export default function Page() {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("stories", { headerCenter: <div>Stories</div> }, <Stories />);
  }, [addColumn])

  return <PinnedColumns />;
}
