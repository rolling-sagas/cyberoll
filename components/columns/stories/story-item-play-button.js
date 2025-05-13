'use client';

import { useCallback, useState } from 'react';
import ResumeSession from './resume-session';
import { useModalStore } from '@/components/modal/dialog-placeholder';

import { Button } from '@/components/ui/button';
import { createSession } from '@/service/session';
import { PlayIcon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';

export default function StoryItemPlayButton({ story, showPlay = false }) {
  const [creatingSession, setCreatingSession] = useState(false);
  const openModal = useModalStore((state) => state.open);
  const closeModal = useModalStore((state) => state.close);
  const router = useRouter();

  const play = useCallback(
    async (id) => {
      setCreatingSession(true);
      try {
        let seid = id;
        if (id === story.id) {
          seid = await createSession(story.id);
        }
        router.push(`/sess/${seid}`);
      } catch (e) {
        console.error(e);
        setCreatingSession(false);
      }
    },
    [story]
  );
  
  const checkHasSession = useCallback(() => {
    if (story.storySessions?.length) {
      openModal(
        <ResumeSession
          onCancel={closeModal}
          onStart={(id) => {
            play(id);
            closeModal();
          }}
          story={story}
        />
      );
    } else {
      play(story.id);
    }
  }, [story, openModal]);

  return (
    <>
      {showPlay ? (
        <Button
          disabled={creatingSession}
          onClick={checkHasSession}
          className="w-full rounded-xl text-background mt-2"
        >
          {creatingSession ? 'Starting...' : 'Play'}{' '}
          <PlayIcon type="sharp" variant="solid" />
        </Button>
      ) : null}
    </>
  );
}
