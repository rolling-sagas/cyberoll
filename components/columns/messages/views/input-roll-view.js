'use-client';

import useStore from '@/stores/editor';
import { rollDice } from '@/stores/actions/dice';

export default function InputRollView({ view }) {
  const rolling = useStore((state) => state.rolling);
  return (
    <div className="input">
      <div>{view.label}</div>
      <button
        className="roll"
        onClick={() => {
          rollDice({ ...view.roll });
        }}
        disabled={rolling > 0}
      >
        {rolling > 0 ? 'Rolling' : 'Roll'}
      </button>
    </div>
  );
}
