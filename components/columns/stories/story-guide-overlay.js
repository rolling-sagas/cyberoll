'use client';

import { HelpCircleIcon, LinkForwardIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';

export default function StoryGuideOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem('hasShownStoryGuide');
    if (!hasShown) {
      setShow(true);
      localStorage.setItem('hasShownStoryGuide', 'true');
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={() => setShow(false)}
    >
      <div className="bg-white rounded-lg px-6 py-4 shadow-lg flex items-center gap-3 max-w-[440px]">
        <span className="text-lg font-medium text-gray-800 flex flex-wrap items-center gap-1">
          Check the Story Creation Guide
          <a
            href="https://helps.rollingsagas.com/#/build_story"
            target="_blank"
            className="inline-flex items-center"
          >
            <LinkForwardIcon size={18} variant="solid" />
          </a>
          , or click the{' '}
          <a
            href="https://helps.rollingsagas.com/#/build_story"
            target="_blank"
            className="inline-flex items-center"
          >
            <HelpCircleIcon size={18} variant="solid" />
          </a>{' '}
          at the top right anytime for quick access.
        </span>
      </div>
    </div>
  );
}
