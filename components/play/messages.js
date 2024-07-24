import Column from "../column/column";

export default function Play() {
  return (
    <Column headerCenter={<div>Messages</div>}>
      <div className="p-4">All the messages</div>
    </Column>
  );
}
