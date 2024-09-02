"use client"

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";

import Threads from "@/components/columns/threads/threads";

export default function Page() {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("threads", { headerCenter: <div>Threads</div> }, <Threads />);
  }, [addColumn])

  return <PinnedColumns />;
}
