"use client"

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";

import Chapters from "@/components/columns/chapters/chapters";

export default function Page() {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("chapters", { headerCenter: <div>Threads</div> }, <Chapters />);
  }, [addColumn])

  return <PinnedColumns />;
}
