"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";

import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect, useState } from "react";

import Session from "@/components/columns/sessions/session";
import { getSession } from "@/service/session";
import useStore from "@/stores/editor";
import { executeScript } from '@/stores/actions/game';

export default function Page({ params }) {
  const id = params.id
  const [session, setSession] = useState(null)

  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  const resetEditor = useStore((state) => state.reset)

  useEffect(() => {
    async function fetchSession(id) {
      const loading = useStore.getState().loading
      if (loading) return
      try {
        useStore.setState(() => ({
          loading: true,
        }))
        resetEditor()
        let res = await getSession(id)
        setSession(res)
        useStore.setState(() => ({
          script: res.script?.value || '',
          components: res.components,
          messages: res.messages,
          storySessionId: res.id,
          autoGenerate: true,
        }))
        executeScript(res.messages.length === 0)
      } finally {
        useStore.setState(() => ({
          loading: false,
        }))
      }
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
