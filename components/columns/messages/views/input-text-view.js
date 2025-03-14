'use-client'

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function InputTextView({ view, id, onClick }) {
  const [inputState, setInputState] = useState();

  return (
    <div className="flex gap-4 action-view">
      <Input
        id={id}
        name={view.name}
        className="rounded-xl h-10 bg-rs-background-1"
        value={inputState || ""}
        onChange={evt => setInputState(evt.target.value)}
        placeholder={view.label}
      />
      <Button
        className="rounded-xl px-4 h-10"
        onClick={() => onClick(inputState)}
        variant="outline"
      >
        OK
      </Button>
    </div>
  );
};
