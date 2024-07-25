import Column from "./column";
export default function ColumnList({ columns }) {
  return (
    <div
      className="flex flex-row overflow-x-auto justify-start
      gap-6 h-full overflow-y-hidden"
    >
      {columns.map((column) => (
        <Column
          key={column.id}
          headerLeft={column.headerLeft}
          headerCenter={column.headerCenter}
          headerRight={column.headerRight}
        >
          {column.children}
        </Column>
      ))}
    </div>
  );
}
