import { Delete02Icon, PinOffIcon } from "@hugeicons/react";
import Column from "../column/column";
import ColumnMenuButton from "../column/column-menu-button";

export default function Prompts() {
  return (
    <Column
      headerCenter={<div>Prompts</div>}
      headerRight={
        <ColumnMenuButton
          items={[
            {
              label: "Unpin",
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
