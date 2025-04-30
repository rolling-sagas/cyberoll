'use client';

import SubscriptionCheck from '@/components/common/subscription-check';
import { AlertPlaceholder } from '@/components/modal/alert-placeholder';
import { ToastPlaceholder } from '@/components/modal/toast-placeholder';
import MatchTheme from '@/components/common/match-theme';
import { DialogPlaceholder } from '@/components/modal/dialog-placeholder';
import FirebaseInit from '@/components/firbase/firebase-init';
import { Suspense } from 'react';

export default function InitialComponents() {
  return (<>
    <FirebaseInit />
    <ToastPlaceholder />
    <DialogPlaceholder />
    <AlertPlaceholder />
    <Suspense fallback={null}>
      <SubscriptionCheck />
    </Suspense>
    <MatchTheme />
  </>)
}
