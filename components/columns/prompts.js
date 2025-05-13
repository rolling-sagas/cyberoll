import { Delete02Icon, PinOffIcon } from '@hugeicons/react';
import Column from '../column/column';
import ColumnMenuButton from '../column/column-menu-button';

import { usePinStore } from './stores';

import { useEffect, useState } from 'react';

import { create } from 'zustand';

const store = create((set) => ({
  prompts: [],
  list: async () => {
    await fetch('/api/story')
      .then((res) => res.json())
      .then((data) => {
        // console.log("data", data)
        set({ prompts: data });
      });
  },
}));

export default function Prompts() {
  const [show, setShow] = useState(true);
  const unpin = usePinStore((state) => state.unpin);

  const list = store((state) => state.list);
  // const prompts = store((state) => state.prompts);

  useEffect(() => {
    list();
  }, [list]);

  return (
    <Column
      show={show}
      afterLeave={() => unpin('prompts')}
      headerCenter={<div>Prompts</div>}
      headerRight={
        <ColumnMenuButton
          items={[
            {
              label: 'Unpin',
              onClick: () => {
                setShow(false);
              },
              right: <PinOffIcon size={20} strokeWidth={2} />,
            },
            {
              label: 'Reset Prompts',
              className: 'text-red-500',
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
