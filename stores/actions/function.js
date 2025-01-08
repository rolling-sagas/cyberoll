import useStore from '../editor';
import { setModal } from './ui';

export const updateFunction = () =>
  useStore.setState((state) => {
    try {
      const funcIndex = state.functions.findIndex(
        (c) => c.name === state.editingFunction.name
      );
      if (funcIndex === -1) {
        return {
          functions: [...state.functions, state.editingFunction],
        };
      }
      return {
        functions: [
          ...state.functions.slice(0, funcIndex),
          state.editingFunction,
          ...state.functions.slice(funcIndex + 1),
        ],
      };
    } catch (e) {
      setModal({
        title: 'Error',
        description: e.message,
        confirm: { label: 'OK' },
      });
      return {};
    }
  });

export const delFunction = (name) =>
  useStore.setState((state) => ({
    functions: state.functions.filter((c) => c.name !== name),
  }));

export const startEditingFunction = (name) => {
  useStore.setState((state) => {
    let functionObj = state.functions.find((c) => c.name === name);
    if (!functionObj) {
      functionObj = {
        name: 'new_function',
        value: `function(){\n  console.log("hello, world!")\n}`,
      };
    }
    return {
      editingFunction: functionObj,
    };
  });
};

export const setEditingFunction = (comp) => {
  useStore.setState(() => ({
    editingFunction: comp ? { name: comp.name, value: comp.value } : null,
  }));
};
