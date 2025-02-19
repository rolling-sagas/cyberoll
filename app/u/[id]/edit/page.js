"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";
import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";
import Profile from "@/components/columns/user/profile";
import Back from "@/components/common/back";

export default function Page() {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("userHome", { headerLeft: <Back />, headerCenter: <div>Edit Profile</div> }, <Profile />);
  }, [addColumn])

  return <PinnedColumns />;
}
