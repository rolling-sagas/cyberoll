"use client"

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";

import UserStories from "@/components/columns/stories/user-stories";

export default function Page() {
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    addColumn("stories", { headerCenter: <div>My Stories</div> }, <UserStories/>);
  }, [addColumn])

  return <PinnedColumns />;
}
