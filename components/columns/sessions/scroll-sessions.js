'use client';
import SessionItem from './session-item';

export default function ScrollSessions({ items = {}, onDelete = () => {} }) {
  return (
    <div className="w-full">
      {items.map((s) => (
        <SessionItem key={s.id} session={s} onDelete={onDelete} />
      ))}
    </div>
  );
}
