"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect, useState } from "react";

import Session from "@/components/columns/sessions/session";
import { getSession } from "@/service/session";

export default function Page({ params }) {
  const id = params.id
  const [session, setSession] = useState(null)

  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    async function fetchSession(id) {
      let res = await getSession(id)
      setSession(res)
    }

    reset()
    fetchSession(id)
  }, [id])

  useEffect(() => {
    if (!session) return
    addColumn("session", {
      headerCenter: session.name,
    }, <Session session={session} />);
  }, [addColumn, session])

  return <PinnedColumns />;
}
