"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";
import Back from "@/components/common/back";

import Plan from "@/components/columns/plan/plan";

export default function Page() {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("stories", { headerLeft: <Back />, headerCenter: <div>My Plan</div> }, <Plan/>);
  }, [addColumn])

  return <PinnedColumns />;
}
