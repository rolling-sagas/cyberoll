import TextareaAutosize from "react-textarea-autosize";
import { useEffect, useRef } from "react";

export const Input = function ({
  name,
  placeholder,
  icon,
  value,
  onChange,
  autoFocus = false,
  autoSize = false,
  editable = true,
}) {
  const inputEl = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      inputEl.current.focus();
    }
  }, [autoFocus]);

  return (
    <div
      className="grid grid-cols-[48px_auto] 
      grid-rows-[21px_19px_max-content_max-conent]
      w-full"
    >
      <div className="pt-1 relative col-start-1 row-span-2">
        <div className="w-9 h-9">{icon}</div>
      </div>
      <div className="font-semibold col-start-2 rows-start-1">{name}</div>
      <TextareaAutosize
        ref={inputEl}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        disabled={!editable}
        className="outline-none col-start-2 rows-start-1 bg-rs-background-2"
        placeholder={placeholder}
      />
    </div>
  );
};
const Dialog = function ({ title, header, body, footer, width = 460 }) {
  return (
    <div
      className="flex flex-col 
      "
    >
      <div
        className="h-[46px] flex flex-row 
        items-center justify-center"
      >
        <div className="font-semibold text-white text-[16px]">{title}</div>
      </div>
      <div className="px-6 mt-2 mb-4">
        <div
          className="bg-rs-background-2 flex flex-col
          border border-rs-border rounded-2xl
          max-w-[calc(100vw-32px)]"
          style={{ width: `${width}px` }}
        >
          <div className="max-h-[calc(100svh-193px)] overflow-y-auto">
            <div className="pt-6 px-6">{header}</div>
            <div className="px-6 py-4 overflow-auto">{body}</div>
          </div>
          <div className="pb-6 px-6 flex flex-row-reverse items-center w-full">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
