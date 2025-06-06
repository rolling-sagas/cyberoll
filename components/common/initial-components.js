'use client';

import { AppealAlertDialog } from '@/components/columns/activity/appeal-alert-dialog';
import { FloatingImage } from '@/components/common/get-ios-app';
import MatchTheme from '@/components/common/match-theme';
import SubscriptionCheck from '@/components/common/subscription-check';
import FirebaseInit from '@/components/firbase/firebase-init';
import { AlertPlaceholder } from '@/components/modal/alert-placeholder';
import { DialogPlaceholder } from '@/components/modal/dialog-placeholder';
import { ToastPlaceholder } from '@/components/modal/toast-placeholder';
import { Suspense } from 'react';
import { save } from '@/utils/logs';
import { useEffect } from 'react';

export default function InitialComponents() {

  useEffect(() => {
    const t = setInterval(save, 5000);
    return () => clearInterval(t);
  }, [])

  return (
    <>
      <FirebaseInit />
      <ToastPlaceholder />
      <DialogPlaceholder />
      <AlertPlaceholder />
      <Suspense fallback={null}>
        <SubscriptionCheck />
      </Suspense>
      <MatchTheme />
      <AppealAlertDialog />
      <FloatingImage />
    </>
  );
}
