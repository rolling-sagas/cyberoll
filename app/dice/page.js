'use client';
export const runtime = 'edge';

import { useEffect, useRef } from 'react';

export default function Page() {
  const db = useRef();

  useEffect(() => {
    async function init() {
      const { default: DiceBox } = await import('@3d-dice/dice-box');
      const diceBox = new DiceBox({
        id: 'dice-box-canvas',
        assetPath: '/assets/dice-box/',
        scale: 8,
        themeColor: '#FF9900',
      });
      await diceBox.init();
      db.current = diceBox;
      const res = await db.current.roll('1d100');
      console.log(res);
    }
    init();
  }, []);

  return null;
}
