'use-client'

import { useState } from "react";

export default function InputTextView({ view, id, onClick }) {
  const [inputState, setInputState] = useState();

  return (
    <div className="input">
      <label htmlFor={id}>{view.label}</label>
      <input
        id={id}
        name={view.name}
        className="input-text"
        value={inputState || ""}
        onChange={evt => setInputState(evt.target.value)}
      />
      <button
        className="submit-btn"
        onClick={() => onClick(inputState)}
      >
        Confirm
      </button>
    </div>
  );
};
