import useStore from '../editor';
import { COMPONENT_TYPE } from '@/utils/const';
import { createComponent, updateComponent as updateComponentReq, deleteComponent as deleteComponentReq } from '@/service/component';
export const updateComponent = async () => {
  useStore.setState({
    isEditing: true,
  })
  try {
    const state = useStore.getState()
    const compIndex = state.components.findIndex(
      (c) => c.id === state.editingComponent.id
    );
    if (compIndex === -1) {
      const comp = await createComponent({
        ...state.editingComponent,
        storyId: state.storyId,
      })
      useStore.setState({
        components: [...state.components, comp],
      })
    } else {
      await updateComponentReq(state.editingComponent.id, state.editingComponent)
      useStore.setState({
        components: [
          ...state.components.slice(0, compIndex),
          state.editingComponent,
          ...state.components.slice(compIndex + 1),
        ],
      })
    }
    useStore.setState({
      editingComponent: null
    })
  } finally {
    useStore.setState({
      isEditing: false,
    })
  }
}

export const delComponent = async (id) => {
  useStore.setState({
    isEditing: true,
  })
  try {
    await deleteComponentReq(id)
    useStore.setState((state) => ({
      components: state.components.filter((c) => c.id !== id),
    }));
  } finally {
    useStore.setState({
      isEditing: false,
    })
  }
}

export const startEditingComponent = (id) => {
  useStore.setState((state) => {
    let component = state.components.find((c) => c.id === id);
    if (!component) {
      component = {
        type: COMPONENT_TYPE.Toml,
        value: '',
      };
    }
    return {
      editingComponent: { ...component },
    };
  });
};

export const setEditingComponent = (comp) => {
  useStore.setState(() => ({
    editingComponent: comp || null,
  }));
};
