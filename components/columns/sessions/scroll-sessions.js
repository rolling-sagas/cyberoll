"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import {
  CircleArrowLeft01Icon,
  CircleArrowRight01Icon,
} from '@hugeicons/react';

import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { getImageUrlById } from "@/components/images/utils";

function LeftArrow() {
  const visibility = useContext(VisibilityContext);
  const isFirstItemVisible = visibility.useIsVisible("first", true);

  const [disabled, setDisabled] = useState(isFirstItemVisible);

  useEffect(() => {
    setDisabled(isFirstItemVisible);
  }, [isFirstItemVisible]);

  return (
    <div className="relative cursor-pointer">
      <div
        className={`${disabled ? "hidden" : ""} absolute z-10`}
        onClick={() => visibility.scrollPrev()}
      >
        <div
          className="absolute z-10 left-4 bg-white/75 
        rounded-full top-[18px]  p-0.5"
        >
          <CircleArrowLeft01Icon className="text-black/75" />
        </div>
      </div>
    </div>
  );
}

function RightArrow() {
  const visibility = useContext(VisibilityContext);
  const isLastItemVisible = visibility.useIsVisible("last", true);

  const [disabled, setDisabled] = useState(isLastItemVisible);

  useEffect(() => {
    setDisabled(isLastItemVisible);
  }, [isLastItemVisible]);

  return (
    <div className="relative cursor-pointer">
      <div
        className={`${disabled ? "hidden" : ""} relative`}
        onClick={() => visibility.scrollNext()}
      >
        <div
          className="absolute z-10 right-4 bg-white/75 
        rounded-full top-[18px] p-0.5"
        >
          <CircleArrowRight01Icon className="text-black/75" />
        </div>
      </div>
    </div>
  );
}

export default function ScrollSessions({ items }) {
  return (
    <div className="no-scrollbar w-full">
      <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
        {items.map((item) => (
          <Link
            href={`/sess/${item.id}`}
            key={item.id}
            className="flex flex-col items-center min-w-16 mx-1"
          >
            <div
              className="bg-gradient-to-bl from-[#ff00d3bf] to-[#4a00ffbf]
              w-16 h-16 p-[2px] rounded-full"
            >
              <div className="p-[2px] w-full h-full rounded-full bg-background">
                <Image
                  src={getImageUrlById(item.image)}
                  className="rounded-full w-full h-full 
                  border border-base-content/50 object-cover object-center"
                  alt="Story Cover"
                  width={128}
                  height={128}
                />
              </div>
            </div>
            <div className="text-xs mt-2 whitespace-nowrap w-full overflow-hidden text-ellipsis max-w-16">{item.name}</div>
          </Link>
        ))}
      </ScrollMenu>
    </div>
  );
}
