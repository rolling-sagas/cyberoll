"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";
import User from "@/components/columns/user/user";
import Back from "@/components/common/back";

export default function Page({params}) {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("userHome", { headerLeft: <Back />, headerCenter: <div>Profile</div> }, <User key={params.id} uid={params.id} />);
  }, [addColumn, params.id])

  return <PinnedColumns />;
}
