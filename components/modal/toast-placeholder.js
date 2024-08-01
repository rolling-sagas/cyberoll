import { Transition } from "@headlessui/react";
import { useToaster } from "react-hot-toast/headless";

export function ToastPlaceholder() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      className="relative z-20"
    >
      <div
        className="flex flex-col-reverse gap-2
        fixed bottom-4 left-[50%] -translate-x-[50%]"
      >
        {toasts.map((toast) => (
          <Transition key={toast.id} show={toast.visible} appear={true}>
            <div
              {...toast.ariaProps}
              className="transition -translate-y-4
                ease-in data-[closed]:opacity-0 data-[closed]:translate-y-0"
            >
              <div
                className="bg-rs-text-primary text-rs-background-2 flex flex-row
                items-center justify-start font-semibold gap-2 transition
                max-w-full w-[320px]
                rounded-2xl shadow-[0_2px_8px_0_rgba(0,0,0,0.4)] px-6 py-4"
              >
                <div className="flex-0">{toast.icon}</div>
                <div className="flex-1">{toast.message}</div>
              </div>
            </div>
          </Transition>
        ))}
      </div>
    </div>
  );
}
