import { create } from "zustand";

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

export const useModalStore = create((set) => ({
  content: null,
  isOpen: false,

  open: (content) => set({ content, isOpen: true }),
  close: () => set({ content: null, isOpen: false }),
}));

export function DialogPlaceholder() {
  const closeModal = useModalStore((state) => state.close);

  const ModalContent = useModalStore((state) => state.content);

  const isOpen = useModalStore((state) => state.isOpen);

  return (
    <Dialog
      open={isOpen}
      transition
      onClose={closeModal}
      className="z-30 transition duration-300
            ease-out data-[closed]:opacity-0 fixed inset-0 
            flex w-screen items-center justify-center p-2"
    >
      <DialogPanel className="z-20 w-full h-full flex justify-center items-center">{ModalContent}</DialogPanel>
      <DialogBackdrop className="fixed inset-0 bg-black/70 z-10" />
    </Dialog>
  );
}
