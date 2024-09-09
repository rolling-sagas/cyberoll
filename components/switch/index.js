import { Switch } from "@headlessui/react";

export default function ToggleSwitch({ value, onChange, disabled }) {
  return (
    <Switch
      disabled={disabled ? disabled : false}
      checked={value}
      onChange={onChange}
      className="group inline-flex h-6 w-11 items-center rounded-full 
      bg-rs-text-secondary transition data-[checked]:bg-blue-600 
      data-[disabled]:bg-gray-100"
    >
      <span
        className="size-4 translate-x-1 rounded-full bg-rs-background-2 
        transition group-data-[checked]:translate-x-6"
      />
    </Switch>
  );
}
