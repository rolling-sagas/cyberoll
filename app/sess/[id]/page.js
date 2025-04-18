'use client';
export const runtime = 'edge';

import PinnedColumns from '@/components/columns/pinned-columns';

import { useColumnsStore } from '@/components/columns/pinned-columns';
import { useEffect, useState } from 'react';

import Session from '@/components/columns/sessions/session';
import { getSession, resetSession } from '@/service/session';
import useStore from '@/stores/editor';
import { executeScript } from '@/stores/actions/game';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import Back from '@/components/common/back';

export default function Page({ params }) {
  const id = params.id;
  const [session, setSession] = useState(null);
  const confirm = useAlertStore((state) => state.confirm);

  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  const resetEditor = useStore((state) => state.reset);

  const fetchSession = async (id) => {
    const loading = useStore.getState().loading;
    if (loading) return;
    try {
      useStore.setState(() => ({
        loading: true,
      }));
      resetEditor({
        loading: true,
      });
      let res = await getSession(id);
      setSession(res);
      useStore.setState(() => ({
        script: res.script?.value || '',
        components: res.components,
        messages: res.messages,
        storySessionId: res.id,
      }));
      executeScript(res.messages.length === 0);
    } finally {
      console.log('finally');
      useStore.setState(() => ({
        loading: false,
      }));
    }
  };

  const resetHandle = () => {
    confirm({
      title: 'Restart game?',
      message:
        'Restart game will delete all generated messages and game state, are you sure?',
      onConfirm: async () => {
        await resetSession(id);
        fetchSession(id);
      },
      confirmLabel: 'Restart',
    });
  };

  useEffect(() => {
    reset();
    fetchSession(id);
  }, [id]);

  useEffect(() => {
    if (!session) return;
    addColumn(
      'session',
      {
        headerLeft: <Back />,
        headerCenter: session.name,
      },
      <Session resetHandle={resetHandle} />
    );
  }, [addColumn, resetHandle]);

  return <PinnedColumns />;
}
