'use-client';

import useStore from '@/stores/editor';
import { rollDice } from '@/stores/actions/dice';
import { Button } from '@/app/components/ui/button';

export default function InputRollView({ view }) {
  const rolling = useStore((state) => state.rolling);
  const doingUserAction = useStore((state) => state.doingUserAction);

  return (
    <div className="action-view input !py-4 !px-6 gp-4">
      <div>{view.label}</div>
      <Button
        className="rounded-xl"
        onClick={() => {
          rollDice({ ...view.roll });
        }}
        disabled={rolling > 0 || doingUserAction}
      >
        {rolling > 0 ? 'Rolling' : 'Roll'}
      </Button>
    </div>
  );
}
