import { useModalStore } from '../modal/dialog-placeholder';
import { goLogout } from '@/utils/index';
import { CinnamonRollIcon } from '@hugeicons/react';
import { Button } from '@/app/components/ui/button';

export const onLoginOut = (story, router) => {
  const openModal = useModalStore.getState().open;
  const closeModal = useModalStore.getState().close;

  openModal(
    <div className="bg-rs-background-2 flex flex-col rounded-2xl w-80 px-6 py-4 gap-3">
      <div className="w-full text-center">
        <CinnamonRollIcon className='inline-block' size={42} strokeWidth="2.5" />
      </div>
      <div className='text-base mb-2 text-center'>Sign out of Rolling Sagas?</div>
      <Button className="rounded-xl" onClick={goLogout}>Sign out</Button>
      <Button className="rounded-xl" variant="outline" onClick={closeModal}>Cancel</Button>
    </div>
  );
};
