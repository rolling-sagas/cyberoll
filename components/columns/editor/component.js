'use-client';

import { setModal } from '@/stores/actions/ui';
import { COMPONENT_TYPE } from '@/utils/const';
import Image from "next/image";
import { getImageUrl } from '@/utils/utils';

export default function Component({ id, name, value, type = 'toml', editFunc, deleteFunc }) {
  return (
    <div className="flex flex-row border-b border-gray-200">
      <button
        className="flex flex-col flex-1 justify-start p-4 gap-2 border-r"
        onClick={() => editFunc(id)}
      >
        <div className="w-full font-semibold flex justify-between">
          <span>{name}</span>
          <em className='text-xs text-gray-400'>{type.toUpperCase()}</em>
        </div>
        {
          type !== COMPONENT_TYPE.Image ?
            <div className="flex-1 text-left line-clamp-1 text-gray-400 break-all">
              {value}
            </div> :
            <Image
              src={getImageUrl(value)}
              width={100}
              height={100}
              className="w-full h-full rounded-sm"
              alt={name}
            />
        }
      </button>
      <button
        className="font-semibold text-sm p-4 hover:bg-red-500 active:bg-red-700 hover:text-white"
        onClick={() => {
          setModal({
            title: 'Delete Component',
            description: `Are you sure you want to delete "${name}"?`,
            confirm: {
              label: 'Delete',
              action: () => deleteFunc(id),
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
