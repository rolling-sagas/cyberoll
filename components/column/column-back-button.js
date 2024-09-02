import { ArrowLeft02Icon } from "@hugeicons/react";
import { useColumnsStore } from "../columns/pinned-columns";

export default function ColumnBackButton({ backId, backChildren, onClick }) {
  const setColumn = useColumnsStore((state) => state.setColumn);
  return (
    <button
      onClick={() => {
        if (onClick) onClick()
        // setColumn(backId, backChildren);
      }}
      className="border rounded-full bg-rs-background-2 outline-none
          w-6 h-6 flex justify-center items-center 
          shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] 
          transition duration-200 ease-out hover:scale-110"
    >
      <ArrowLeft02Icon size={12} variant="solid" />
    </button>
  );
}
