"use client";

import SessionItem from "./session-item";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function ScrollSessions({ items = {}, onDelete = () => {} }) {
  return (
    <div className="w-full">
      <Carousel>
        <CarouselContent>
          {
            items.map(s => <CarouselItem key={s.id} className="basis-full">
              <SessionItem session={s} onDelete={onDelete}/>
            </CarouselItem>)
          }
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}
