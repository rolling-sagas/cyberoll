import { CloseButton } from "@headlessui/react";

export default function Alert({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  width = 280,
}) {
  return (
    <div className="flex flex-col">
      <div
        className="bg-rs-background-2 flex flex-col
          border border-rs-border rounded-2xl
          max-w-[calc(100vw-32px)]"
        style={{ width: `${width}px` }}
      >
        <div className="pt-6 px-6">
          <div className="font-semibold text-[16px] text-center">{title}</div>
        </div>
        <div className="px-6 py-4">
          <div className="text-center text-rs-text-secondary">{message}</div>
        </div>
        <div
          className="flex flex-row
          w-full border-t h-[54px]"
        >
          <CloseButton onClick={() => onCancel ? onCancel() : null} className="border-r flex-1 flex justify-center items-center">
            {cancelLabel}
          </CloseButton>
          <CloseButton
            className="flex-1 flex justify-center 
            items-center font-bold"
            onClick={onConfirm}
          >
            {confirmLabel}
          </CloseButton>
        </div>
      </div>
    </div>
  );
}
