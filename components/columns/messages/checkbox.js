'use-client'

import { Checkbox, Label, Field } from "@headlessui/react";

export default function CheckboxView({ label, checked, onChange }) {
  return (
    <Field className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className="group size-4 rounded-md border border-gray-400 relative data-[checked]:border-blue-400"
      >
        <div className="absolute top-[1px] left-[1px] hidden size-2 stroke-blue-400 group-data-[checked]:block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={12}
            height={12}
            color="currentColor"
            fill={"none"}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.6905 5.77665C20.09 6.15799 20.1047 6.79098 19.7234 7.19048L9.22336 18.1905C9.03745 18.3852 8.78086 18.4968 8.51163 18.4999C8.2424 18.5031 7.98328 18.3975 7.79289 18.2071L4.29289 14.7071C3.90237 14.3166 3.90237 13.6834 4.29289 13.2929C4.68342 12.9024 5.31658 12.9024 5.70711 13.2929L8.48336 16.0692L18.2766 5.80953C18.658 5.41003 19.291 5.39531 19.6905 5.77665Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </Checkbox>
      <Label>{label}</Label>
    </Field>
  );
}
