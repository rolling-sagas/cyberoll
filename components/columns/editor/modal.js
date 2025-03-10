'use-client'

import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import useStore from "@/stores/editor";
import { setModal } from "@/stores/actions/ui";

function Modal() {
  const modal = useStore((state) => state.modal);
  return (
    <Dialog
      open={modal !== null}
      onClose={() => setModal(null)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="min-w-96 max-w-lg border bg-white p-8 rounded-xl flex flex-col gap-4">
          <DialogTitle className="font-bold">{modal?.title}</DialogTitle>
          <Description>{modal?.description}</Description>
          <p>{modal?.content}</p>
          <div className="flex flex-row gap-4 lg !justify-end modal-buttons">
            {modal?.confirm && (
              <button
                className="btn-default"
                onClick={() => {
                  setModal(null);
                  modal.confirm.action && modal.confirm.action();
                }}
              >
                {modal.confirm.label}
              </button>
            )}
            {modal?.cancel && (
              <button
                className="btn-default"
                onClick={() => {
                  setModal(null);
                  modal.cancel.action && modal.cancel.action();
                }}
              >
                {modal.cancel.label}
              </button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default Modal;
