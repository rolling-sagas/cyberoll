import { Listbox, ListboxButton, ListboxOption, ListboxOptions }
  from '@headlessui/react'

import "./list-box.css"
import { ArrowDown01Icon, Tick01Icon } from '@hugeicons/react'

export default function ListBox({ list, value, onChange, disabled = false }) {
  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton className="lb-button">
        <span className="flex-1">
          {(list.find(item => item.value === value)).label}
        </span>
        <ArrowDown01Icon size={20} />
      </ListboxButton>
      <ListboxOptions anchor="bottom" transition className="z-20 lb-options">
        {list.filter(t => t.value !== value).map((t) => (
          <ListboxOption key={t.key} value={t.value} className="lb-option group">
            <span className='flex-1 text-center'>{t.label}</span>
            <Tick01Icon className="group-data-[focus]:block hidden" size={20} />
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>)
}
