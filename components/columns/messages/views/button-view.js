'use-client'

export default function ButtonView({ view, onClick }) {
  return (
    <div className="button" onClick={onClick}>
      {view.label}
    </div>
  );
}
