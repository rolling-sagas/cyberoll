import { Button } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";

export default function NavButton({ href, children, active }) {
  return (
    <Button as={Fragment}>
      <Link
        href={href}
        {...(active ? { "data-active": true } : {})}
        className="group sm:w-[60px] sm:h-[60px] w-10 h-10
        flex justify-center items-center relative"
      >
        <div
          className="group-data-[hover]:scale-110          
          transition duration-200 w-6 h-6 z-[1] 
          text-rs-text-secondary group-data-[active]:text-rs-text-primary"
        >
          {children}
        </div>
        <div
          className="transition absolute w-full h-full rounded-lg
            top-0 left-0 bg-neutral-200/0 scale-50 duration-200 
            group-data-[hover]:scale-100 
            group-data-[hover]:bg-rs-background-hover"
        />
      </Link>
    </Button>
  );
}
