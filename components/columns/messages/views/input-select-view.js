'use-client'

export default function InputSelectView({ view, onClick }) {
  return (
    <div className="input">
      <div>{view.label}</div>
      <div className="input-options">
        {view.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onClick(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
