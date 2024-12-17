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
import { parseError } from '@/components/utils';

export const createComponentStore = (id) =>
  createStore((set) => ({
    id: id,
    loading: 'pending',
    components: [],

    listComponents: async () => {
      const response = await fetch(`/api/chapter/${id}/component`);
      const res = await response.json();

      if (res.error) {
        throw res.error;
      } else {
        set({ components: res, loading: 'loaded' });
      }
      // console.log("messages", data.id, messages);
    },

    resetComponents: async () => {
      const response = await fetch(`/api/chapter/${id}/component/reset`, {
        method: 'POST',
      });

      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
    },

    newImageComponent: async (name, imageDesc, image) => {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('desc', imageDesc);
      formData.append('file', image);
      const response = await fetch(`/api/chapter/${id}/component`, {
        method: 'PUT',
        body: formData,
      });
      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
    },

    newComponent: async (name, type, value) => {
      const response = await fetch(`/api/chapter/${id}/component`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            name,
            type,
            value: value,
            initial: value,
          },
        }),
      });
      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
    },

    updateImageComponent: async (
      oldName,
      oldValue,
      name,
      desc,
      file,
      isInitial
    ) => {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('value', oldValue);
      formData.append('isInitial', isInitial);

      if (desc !== '') {
        formData.append('desc', desc);
      }

      if (file) {
        formData.append('file', file);
      }

      const response = await fetch(`/api/chapter/${id}/component/${oldName}`, {
        method: 'PUT',
        body: formData,
      });

      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
    },

    updateComponent: async (pid, name, type, value, initial) => {
      const response = await fetch('/api/chapter/' + id + '/component/' + pid, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          data: { name, type, value, initial },
        }),
      });
      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
    },

    deleteComponent: async (pid) => {
      const response = await fetch('/api/chapter/' + id + '/component/' + pid, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
    },

    deleteComponentsBelow: async (pid) => {
      const response = await fetch(
        '/api/chapter/' + id + '/component/' + pid + '?below=true',
        {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          },
        }
      );
      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
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

  if (loading === 'pending') {
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
        {components.map((prop) => (
          <ComponentItem
            key={prop.name}
            isLast={prop.name === components[components.length - 1].name}
            component={prop}
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
                      await deleteComponent(prop.id);
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
                  name={prop.name}
                  type={prop.type}
                  value={prop.value}
                  initial={prop.initial}
                  onConfirm={async (name, type, value, initial) => {
                    const tid = toast.loading('Updating component...', {
                      icon: <Spinner />,
                    });
                    try {
                      await updateComponent(
                        prop.id,
                        name,
                        type,
                        value,
                        initial
                      );
                      toast.success('Component updated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    } catch (e) {
                      toast.dismiss(tid);
                      AlertError(
                        "Can't update the component: " + parseError(e)
                      );
                    } finally {
                      await listComponents();
                    }
                  }}
                  onImageConfirm={async (name, imageDesc, image, isInitial) => {
                    const tid = toast.loading('Updating image component...', {
                      icon: <Spinner />,
                    });
                    try {
                      await updateImageComponent(
                        prop.name,
                        prop.value,
                        name,
                        imageDesc,
                        image,
                        isInitial
                      );
                      toast.success('Component updated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    } catch (e) {
                      toast.dismiss(tid);
                      AlertError(
                        "Can't update the image component: " + parseError(e)
                      );
                    } finally {
                      await listComponents();
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
