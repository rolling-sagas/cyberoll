'use-client';

import { setModal } from '@/stores/actions/ui';

function Component({ name, value, editFunc, deleteFunc }) {
  return (
    <div className="flex flex-row border-b border-gray-200">
      <button
        className="flex flex-row items-center flex-1 justify-start p-4 gap-2 border-r"
        onClick={() => editFunc(name)}
      >
        <div className="font-semibold">{name}</div>
        <div className="flex-1 text-left line-clamp-1 text-gray-400 break-all">
          {value}
        </div>
      </button>
      <button
        className="font-semibold text-sm p-4 hover:bg-red-500 active:bg-red-700 hover:text-white"
        onClick={() => {
          setModal({
            title: 'Delete Component',
            description: `Are you sure you want to delete "${name}"?`,
            confirm: {
              label: 'Delete',
              action: () => deleteFunc(name),
            },
            cancel: { label: 'Cancel' },
          });
        }}
      >
        Delete
      </button>
    </div>
  );
}

function ComponentList({ list, editFunc, deleteFunc }) {
  return (
    <div className="border border-gray-200 rounded h-full overflow-hidden !flex-1 relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col overflow-y-auto overflow-x-auto">
        {list.map((component) => (
          <Component
            editFunc={editFunc}
            deleteFunc={deleteFunc}
            name={component.name}
            value={component.value}
            key={component.name}
          />
        ))}
      </div>
    </div>
  );
}

export default ComponentList;
