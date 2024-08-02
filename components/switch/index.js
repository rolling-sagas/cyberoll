import { Switch } from "@headlessui/react";

export default function ToggleSwitch({ value, onChange }) {
  return (
    <Switch
      checked={value}
      onChange={onChange}
      className="group inline-flex h-6 w-11 items-center rounded-full 
      bg-rs-background-3 transition data-[checked]:bg-blue-600 border"
    >
      <span
        className="size-4 translate-x-1 rounded-full bg-rs-background-2 
        transition group-data-[checked]:translate-x-6 border"
      />
    </Switch>
  );
}
