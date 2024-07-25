import { Delete02Icon, PinOffIcon } from "@hugeicons/react";
import Column from "../column/column";
import ColumnMenuButton from "../column/column-menu-button";

import { usePinStore } from "./stores";

import { useState } from "react";

export default function Prompts() {
  const [show, setShow] = useState(true);
  const unpin = usePinStore((state) => state.unpin);

  return (
    <Column
      show={show}
      afterLeave={() => unpin("prompts")}
      headerCenter={<div>Prompts</div>}
      headerRight={
        <ColumnMenuButton
          items={[
            {
              label: "Unpin",
              onClick: () => {
                setShow(false);
              },
              right: <PinOffIcon size={20} strokeWidth={2} />,
            },
            {
              label: "Reset Prompts",
              className: "text-red-500",
              right: (
                <Delete02Icon
                  size={20}
                  strokeWidth={2}
                  className="text-red-500"
                />
              ),
            },
          ]}
        />
      }
    >
      <div className="p-4">All the prompts</div>
    </Column>
  );
}
