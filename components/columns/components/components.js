'use client';
import { createStore, useStore } from 'zustand';
import Spinner from '../spinner';
import { useEffect } from 'react';

import { useModalStore } from '@/components/modal/dialog-placeholder';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import BaseButton from '@/components/buttons/base-button';
import Alert from '@/components/modal/alert';

import CreateComponentDialog from './create-component-dialog';
import { toast } from 'react-hot-toast/headless';
import { Add01Icon, CheckmarkCircle01Icon } from '@hugeicons/react';
import ComponentItem from './component-item';
import { parseError } from '@/utils/utils';
import {
  getComponents,
  createComponent,
  deleteComponent,
  updateComponent,
  resetComponents
} from '@/service/component';
import { uploadImage } from '@/service/upload';

export const createComponentStore = (id) =>
  createStore((set, get) => ({
    id: id,
    loading: true,
    components: [],

    listComponents: async () => {
      set({
        loading: true,
      });
      try {
        const res = await getComponents(id);
        set({ components: res });
      } finally {
        set({
          loading: false,
        });
      }
    },

    resetComponents: async () => {
      await resetComponents(undefined, id)
    },

    newImageComponent: async (name, desc, image) => {
      const img = await uploadImage(image);
      const value = JSON.stringify({
        ...img,
        desc,
      });
      await get().newComponent(name, 'img', value);
    },

    newComponent: async (name, type, value) => {
      await createComponent({
        name,
        type,
        value: value,
        initial: value,
        chapterId: id,
      });
    },

    updateImageComponent: async (
      component,
      name,
      desc,
      image,
      isInitial
    ) => {
      let newVal = JSON.parse(isInitial ? component.initial : component.value)
      if (image) {
        const img = await uploadImage(image);
        newVal = {
          ...img,
          desc,
        };
      }
      if (newVal.desc !== desc) {
        newVal.desc = desc
      }
      newVal = JSON.stringify(newVal)
      const value = isInitial ? component.value : newVal
      const initial = isInitial ? newVal : component.initial
      await get().updateComponent(component.id, name, component.type, value, initial)
    },

    updateComponent: async (coid, name, type, value, initial) => {
      await updateComponent(coid, {
        name,
        type,
        value,
        initial,
      });
    },
    deleteComponent: async (coid) => {
      await deleteComponent(coid);
    },
  }));

function CreateComponent({ store }) {
  const openModal = useModalStore((state) => state.open);

  const newComponent = useStore(store, (state) => state.newComponent);
  const newImageComponent = useStore(store, (state) => state.newImageComponent);

  const listComponents = useStore(store, (state) => state.listComponents);

  const openAlert = useAlertStore((state) => state.open);

  function AlertError(message) {
    openAlert(
      <Alert
        title="Oops, something wrong!"
        message={message}
        confirmLabel="OK"
      />
    );
  }

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(
            <CreateComponentDialog
              onConfirm={async (name, type, value, initial) => {
                const tid = toast.loading('Creating component...', {
                  icon: <Spinner />,
                });
                try {
                  await newComponent(name, type, initial);
                  toast.success('Component created', {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid);
                  AlertError("Can't create the component: " + parseError(e));
                } finally {
                  await listComponents();
                }
              }}
              onImageConfirm={async (name, imageDesc, image) => {
                const tid = toast.loading('Creating image component...', {
                  icon: <Spinner />,
                });
                try {
                  await newImageComponent(name, imageDesc, image);
                  toast.success('Image component created', {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid);
                  AlertError("Can't create the component: " + parseError(e));
                } finally {
                  await listComponents();
                }
              }}
            />
          )
        }
      >
        <Add01Icon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Create a component
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
}

export default function Components({ storeRef }) {
  const openModal = useModalStore((state) => state.open);
  const openAlert = useAlertStore((state) => state.open);

  function AlertError(message) {
    openAlert(
      <Alert
        title="Oops, something wrong!"
        message={message}
        confirmLabel="OK"
      />
    );
  }

  const components = useStore(storeRef.current, (state) => state.components);
  const loading = useStore(storeRef.current, (state) => state.loading);

  const listComponents = useStore(
    storeRef.current,
    (state) => state.listComponents
  );

  const newComponent = useStore(
    storeRef.current,
    (state) => state.newComponent
  );
  const newImageComponent = useStore(
    storeRef.current,
    (state) => state.newImageComponent
  );

  const deleteComponent = useStore(
    storeRef.current,
    (state) => state.deleteComponent
  );

  const updateComponent = useStore(
    storeRef.current,
    (state) => state.updateComponent
  );

  const updateImageComponent = useStore(
    storeRef.current,
    (state) => state.updateImageComponent
  );

  useEffect(() => {
    if (listComponents) {
      listComponents();
    }
  }, [listComponents]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No components here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateComponentDialog
                onConfirm={async (name, type, value, initial) => {
                  const tid = toast.loading('Creating component...', {
                    icon: <Spinner />,
                  });
                  try {
                    await newComponent(name, type, initial);
                    toast.success('Component created', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                    await listComponents();
                  } catch (e) {
                    toast.dismiss(tid);
                    AlertError("Can't create the component: " + parseError(e));
                  }
                }}
                onImageConfirm={async (name, imageDesc, image) => {
                  const tid = toast.loading('Creating image component...', {
                    icon: <Spinner />,
                  });
                  try {
                    await newImageComponent(name, imageDesc, image);
                    toast.success('Image component created', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                    await listComponents();
                  } catch (e) {
                    toast.dismiss(tid);
                    AlertError("Can't create the component: " + parseError(e));
                  }
                }}
              />
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CreateComponent store={storeRef.current} />
      <div
        className="flex flex-col flex-1 scroll-smooth overflow-y-auto 
        overflow-x-hidden"
      >
        {components.map((component) => (
          <ComponentItem
            key={component.name}
            isLast={component.name === components[components.length - 1].name}
            component={component}
            onDeleteClick={() => {
              openAlert(
                <Alert
                  title="Delete component?"
                  message="If you delete this component, 
                you won't be able to restore it."
                  onConfirm={async () => {
                    const tid = toast.loading('Deleting component...', {
                      icon: <Spinner />,
                    });
                    try {
                      await deleteComponent(component.id);
                      toast.success('Component deleted', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    } catch (e) {
                      toast.dismiss(tid);
                      AlertError(
                        "Can't delete the component: " + parseError(e)
                      );
                    } finally {
                      await listComponents();
                    }
                  }}
                />
              );
            }}
            onUpdateClick={() => {
              openModal(
                <CreateComponentDialog
                  name={component.name}
                  type={component.type}
                  value={component.value}
                  initial={component.initial}
                  onConfirm={async (name, type, value, initial) => {
                    const tid = toast.loading('Updating component...', {
                      icon: <Spinner />,
                    });
                    try {
                      await updateComponent(
                        component.id,
                        name,
                        type,
                        value,
                        initial
                      );
                      toast.success('Component updated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                      await listComponents();
                    } catch (e) {
                      toast.dismiss(tid);
                      AlertError(
                        "Can't update the component: " + parseError(e)
                      );
                    }
                  }}
                  onImageConfirm={async (name, imageDesc, image, isInitial) => {
                    const tid = toast.loading('Updating image component...', {
                      icon: <Spinner />,
                    });
                    try {
                      await updateImageComponent(
                        component,
                        name,
                        imageDesc,
                        image,
                        isInitial
                      );
                      toast.success('Component updated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                      await listComponents();
                    } catch (e) {
                      console.error(e)
                      toast.dismiss(tid);
                      AlertError(
                        "Can't update the image component: " + parseError(e)
                      );
                    }
                  }}
                />
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
