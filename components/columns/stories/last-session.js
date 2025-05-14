'use client';

import { useEffect, useState, useCallback } from 'react';
import SessionItem from '../sessions/session-item';
import BaseButton from '@/components/buttons/base-button';
import Avatar from '@/components/common/avatar';
import { createSession } from '@/service/session';
import useUserStore from '@/stores/user';
import { useRouter } from 'next/navigation';
import { getSessions } from '@/service/session';

export default function LastSession() {
  const [session, setSession] = useState(null);
  const userInfo = useUserStore((state) => state.userInfo);
  const router = useRouter();

  const [sid, setSid] = useState('');
  const [creatingSession, setCreatingSession] = useState(false);

  const play = useCallback(async () => {
    if (creatingSession) return;
    setCreatingSession(true);
    try {
      const seid = await createSession(sid);
      router.push(`/sess/${seid}`);
    } catch (e) {
      console.error(e);
      setCreatingSession(false);
    }
  }, [sid]);

  const listSessions = async () => {
    const { sessions: list, randomSid } = await getSessions(0, 1);
    setSession(list[0]);
    setSid(randomSid);
  };

  useEffect(() => {
    if (userInfo) {
      listSessions();
    }
  }, [userInfo]);

  return (
    <>
      {session ? (
        <SessionItem
          key={session?.id}
          session={session}
          onDelete={listSessions}
          lastPlayed
        />
      ) : null}
      {!session && sid ? (
        <div className="w-full px-6 border-b">
          <div className="flex flex-row py-4 items-center" onClick={play}>
            <Avatar image={userInfo?.image} size={36} name={userInfo?.name} />
            <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
              Looking for anything fun?
            </div>
            <BaseButton
              disabled={creatingSession}
              label={creatingSession ? 'Starting...' : 'Quick Start'}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
