import Column from "./column";
export default function ColumnList({ columns }) {
  return (
    <div
      className="flex flex-row overflow-x-auto 
      gap-6 h-full overflow-y-clip"
    >
      {columns.map((column) => (
        <Column
          key={column.id}
          headerLeft={column.headerLeft}
          headerCenter={column.headerCenter}
          headerRight={column.headerRight}
          children={column.children}
        />
      ))}
    </div>
  );
}
