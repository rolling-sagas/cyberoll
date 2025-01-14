'use-client';

import Component from "./component";
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
            type={component.type}
            key={component.id}
            id={component.id}
          />
        ))}
      </div>
    </div>
  );
}

export default ComponentList;
