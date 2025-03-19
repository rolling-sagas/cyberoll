import { create } from 'zustand';

import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';

export const useModalStore = create((set) => ({
  content: null,
  isOpen: false,
  backdropClosable: true,
  open: (content, backdropClosable = true) => set({ content, isOpen: true, backdropClosable }),
  close: () => set({ content: null, isOpen: false }),
}));

export function DialogPlaceholder() {
  const closeModal = useModalStore((state) => state.close);
  const backdropClosable = useModalStore((state) => state.backdropClosable);

  const ModalContent = useModalStore((state) => state.content);

  const isOpen = useModalStore((state) => state.isOpen);

  return (
    <Dialog
      open={isOpen}
      transition
      onClose={closeModal}
      className="z-30 transition duration-300
            ease-out data-[closed]:opacity-0 fixed inset-0 
            flex w-screen items-center justify-center p-2 overflow-hidden"
    >
      <DialogPanel
        className={
          backdropClosable
            ? 'z-20 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'z-20 w-full h-full flex justify-center items-center'
        }
      >
        {ModalContent}
      </DialogPanel>
      <DialogBackdrop className="fixed inset-0 bg-black/70 z-10" />
    </Dialog>
  );
}
