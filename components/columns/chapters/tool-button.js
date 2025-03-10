import { Button } from "@headlessui/react";

export default function ToolButton({ children, onClick }) {
  return (
    <Button
      onClick={onClick}
      className="group w-fit h-fit 
        flex justify-center items-center relative"
    >
      <div
        className="transition duration-200 
          h-fit w-fit z-[1] flex items-center justify-center
          text-rs-text-secondary"
      >
        {children}
      </div>
      <div
        className={`transition absolute rounded-3xl ease-out
            w-[calc(100%+16px)] h-[calc(100%+16px)]
            hover:bg-rs-background-hover scale-75 duration-200 
            group-data-[hover]:scale-100
            group-data-[hover]:bg-rs-background-hover`}
      />
    </Button>
  );
}
