'use-client';

import useStore from '@/stores/editor';
import { rollDice } from '@/stores/actions/dice';

export default function InputRollView({ view }) {
  const rolling = useStore((state) => state.rolling);
  const generating = useStore((state) => state.generating);

  return (
    <div className="input">
      <div>{view.label}</div>
      <button
        className="roll"
        onClick={() => {
          rollDice({ ...view.roll });
        }}
        disabled={rolling > 0 || generating}
      >
        {rolling > 0 || generating ? 'Rolling' : 'Roll'}
      </button>
    </div>
  );
}
