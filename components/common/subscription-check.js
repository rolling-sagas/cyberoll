'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hasOpenedStripe, isSubscriptionChanged } from '@/service/subscription';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/app/components/ui/button';
import useUserStore from '@/stores/user';

export default function SubscriptionCheck() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false)
  const dailyCheck = useUserStore(state => state.dailyCheck)

  useEffect(() => {
    const check = async () => {
      if (hasOpenedStripe()) {
        const success = searchParams.get('success');
        if (success) {
          const changed = await isSubscriptionChanged();
          if (changed) {
            setOpen(true)
          }
          return
        }
      }
      dailyCheck()
    };
    check();
  }, []);

  return (
    <Dialog open={open} onOpenChange={open => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nitifition!</DialogTitle>
          <DialogDescription>
            Your subscription plan has changed, you can reload page to update
            your plan or reload later! Reload page to update!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Reload Later
            </Button>
            <Button
              onClick={() => location.reload()}
            >
              Reload Now
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
