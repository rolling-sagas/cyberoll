import useStore from '../editor';
import { setModal } from './ui';

export const updateComponent = () =>
  useStore.setState((state) => {
    try {
      const compIndex = state.components.findIndex(
        (c) => c.name === state.editingComponent.name
      );
      if (compIndex === -1) {
        return {
          components: [...state.components, state.editingComponent],
        };
      }
      return {
        components: [
          ...state.components.slice(0, compIndex),
          state.editingComponent,
          ...state.components.slice(compIndex + 1),
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

export const delComponent = (name) =>
  useStore.setState((state) => ({
    components: state.components.filter((c) => c.name !== name),
  }));

export const startEditingComponent = (name) => {
  useStore.setState((state) => {
    let component = state.components.find((c) => c.name === name);
    if (!component) {
      component = { name: 'new_component', value: `value = "Hello, world!"` };
    }
    return {
      editingComponent: component,
    };
  });
};

export const setEditingComponent = (comp) => {
  useStore.setState(() => ({
    editingComponent: comp ? { name: comp.name, value: comp.value } : null,
  }));
};
