import { create } from "zustand";
import Alert from '@/components/modal/alert';

import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";

export const useAlertStore = create((set) => ({
  content: null,
  isOpen: false,

  open: (content) => set({ content, isOpen: true }),
  close: () => set({ content: null, isOpen: false }),
  confirm: ({title, message, onConfirm, onCancel, confirmLabel, cancelLabel }) => {
    set({
      content: (
        <Alert
          title={title}
          message={message}
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmLabel={confirmLabel}
          cancelLabel={cancelLabel}
        />
      ),
      isOpen: true,
    })
  },
}));

export function AlertPlaceholder() {
  const closeModal = useAlertStore((state) => state.close);

  const content = useAlertStore((state) => state.content);

  const isOpen = useAlertStore((state) => state.isOpen);

  return (
    <Dialog
      open={isOpen}
      transition
      onClose={closeModal}
      className="z-40 transition duration-300
            ease-out data-[closed]:opacity-0 fixed inset-0 
            flex w-screen items-center justify-center p-2"
    >
      <DialogPanel className="z-20">{content}</DialogPanel>
      <DialogBackdrop className="fixed inset-0 bg-black/70 z-10" />
    </Dialog>
  );
}
