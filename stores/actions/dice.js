import DiceBox from '@3d-dice/dice-box';
import useStore from '../editor';

let diceBox = null;

export const setDiceBox = async (container) => {
  const dice = new DiceBox({
    container: `#${container.id}`,
    assetPath: 'assets/',
    origin: 'https://cdn.jsdelivr.net/npm/@3d-dice/dice-box@1.1.4/dist/',
    onRollComplete: (res) => {
      useStore.setState((state) => ({
        rolling: 2,
        lastRoll: { ...state.lastRoll, value: res[0].value },
      }));
    },
  });

  diceBox = dice;
  await diceBox.init();
};

export const rollDice = (rollObj) => {
  diceBox.roll(rollObj?.notation || '1d100');
  useStore.setState(() => ({
    rolling: 1,
    lastRoll: { ...rollObj },
  }));
};

export const clearRoll = async () => {
  await diceBox.clear();
  useStore.setState(() => ({
    rolling: 0,
    lastRoll: null,
  }));
};
