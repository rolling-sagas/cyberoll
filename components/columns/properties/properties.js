"use client"
import { createStore, useStore } from "zustand";
import Spinner from "../spinner";
import { useEffect } from "react";

import { useModalStore } from "@/components/modal/dialog-placeholder";
import { useAlertStore } from "@/components/modal/alert-placeholder";
import BaseButton from "@/components/buttons/base-button";
import Alert from "@/components/modal/alert";

import CreatePropertyDialog from "./create-property-dialog";
import { toast } from "react-hot-toast/headless";
import { Add01Icon, CheckmarkCircle01Icon } from "@hugeicons/react";
import PropertyItem from "./property-item";
import { parseError } from "@/components/ui-utils";

export const createPropertyStore = (id) =>
  createStore((set) => ({
    id: id,

    loading: "pending",

    properties: [],

    listProperties: async () => {
      const response = await fetch(`/api/session/${id}/property`);
      const res = await response.json();

      if (res.error) {
        throw res.error
      } else {
        set({ properties: res, loading: "loaded" });
      }
      // console.log("messages", data.id, messages);
    },

    resetProperties: async () => {
      const response = await fetch(`/api/session/${id}/property/reset`, {
        method: "POST",
      });
      const res = await response.json();
      if (res.error) {
        throw res.error
      }
    },

    newImageProperty: async (name, imageDesc, image) => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("desc", imageDesc);
      formData.append("file", image);
      const response = await fetch(`/api/session/${id}/property`, {
        method: "PUT",
        body: formData,
      });
      const res = await response.json();
      if (res.error) {
        throw res.error
      }
    },

    newProperty: async (name, type, value) => {
      const response = await fetch(`/api/session/${id}/property`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          data: {
            name, type,
            value: value, initial: value
          }
        }),
      });
      const res = await response.json();
      if (res.error) {
        throw res.error
      }
    },

    updateImageProperty: async (oldName, oldValue, name, desc, file,
      isInitial) => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("value", oldValue)
      formData.append("isInitial", isInitial)

      if (desc !== "") {
        formData.append("desc", desc);
      }

      if (file) {
        formData.append("file", file);
      }

      const response = await fetch(`/api/session/${id}/property/${oldName}`, {
        method: "PUT",
        body: formData,
      });

      const res = await response.json();
      if (res.error) {
        throw res.error
      }
    },

    updateProperty: async (oldName, name, type, value, initial) => {
      const response = await fetch(
        "/api/session/" + id + "/property/" + oldName,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            data: { name, type, value, initial },
          }),
        },
      );
      const res = await response.json();
      if (res.error) {
        throw res.error
      }
    },

    deleteProperty: async (name) => {
      const response = await fetch("/api/session/" + id + "/property/" + name, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
      const res = await response.json();
      if (res.error) {
        throw res.error
      }
    },

    deletePropertiesBelow: async (pid) => {
      const response = await fetch(
        "/api/session/" + id + "/property/" + pid + "?below=true",
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        },
      );
      const res = await response.json();
      if (res.error) {
        throw res.error
      }
    },
  }));

function CreateProperty({ store }) {
  const openModal = useModalStore((state) => state.open);

  const newProperty = useStore(store, (state) => state.newProperty);
  const newImageProperty = useStore(store, (state) => state.newImageProperty);

  const listProperties = useStore(store, (state) => state.listProperties);

  const openAlert = useAlertStore((state) => state.open);

  function AlertError(message) {
    openAlert(<Alert title="Oops, something wrong!"
      message={message}
      confirmLabel="OK" />)
  }

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(
            <CreatePropertyDialog
              onConfirm={async (name, type, value, initial) => {
                const tid = toast.loading("Creating property...", {
                  icon: <Spinner />,
                });
                try {
                  await newProperty(name, type, initial);
                  toast.success("Property created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid);
                  AlertError("Can't create the property: " + parseError(e))
                } finally {
                  await listProperties();
                }
              }}

              onImageConfirm={async (name, imageDesc, image) => {
                const tid = toast.loading("Creating image property...", {
                  icon: <Spinner />,
                });
                try {
                  await newImageProperty(name, imageDesc, image);
                  toast.success("Image property created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid);
                  AlertError("Can't create the property: " + parseError(e))
                } finally {
                  await listProperties();
                }
              }}
            />,
          )
        }
      >
        <Add01Icon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Create a property
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
}

export default function Properties({ storeRef }) {
  const openModal = useModalStore((state) => state.open);
  const openAlert = useAlertStore((state) => state.open);

  const properties = useStore(storeRef.current, (state) => state.properties);
  const loading = useStore(storeRef.current, (state) => state.loading);

  const listProperties = useStore(
    storeRef.current,
    (state) => state.listProperties,
  );

  const newProperty = useStore(storeRef.current, (state) => state.newProperty);
  const newImageProperty = useStore(storeRef.current, (state) => state.newImageProperty);

  const deleteProperty = useStore(
    storeRef.current,
    (state) => state.deleteProperty,
  );

  const updateProperty = useStore(
    storeRef.current,
    (state) => state.updateProperty,
  );

  const updateImageProperty = useStore(
    storeRef.current,
    (state) => state.updateImageProperty,
  );

  useEffect(() => {
    if (listProperties) {
      listProperties();
    }
  }, [listProperties]);

  if (loading === "pending") {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }


  if (properties.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No properties here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreatePropertyDialog
                onConfirm={async (name, type, value, initial) => {
                  const tid = toast.loading("Creating property...", {
                    icon: <Spinner />,
                  });
                  await newProperty(name, type, initial);
                  await listProperties();
                  toast.success("Property created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                }}

                onImageConfirm={async (name, imageDesc, image) => {
                  const tid = toast.loading("Creating image property...", {
                    icon: <Spinner />,
                  });
                  await newImageProperty(name, imageDesc, image);
                  await listProperties();
                  toast.success("Image property created", {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                }}
              />,
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <CreateProperty store={storeRef.current} />
      <div className="flex flex-col flex-1 scroll-smooth overflow-y-auto 
        overflow-x-hidden">
        {properties.map((prop) => (
          <PropertyItem
            key={prop.name}
            isLast={prop.name === properties[properties.length - 1].name}
            property={prop}
            onDeleteClick={() => {
              openAlert(
                <Alert
                  title="Delete property?"
                  message="If you delete this property, 
                you won't be able to restore it."
                  onConfirm={async () => {
                    const tid = toast.loading("Deleting property...", {
                      icon: <Spinner />,
                    });
                    await deleteProperty(prop.name);
                    await listProperties();
                    toast.success("Property deleted", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }}
                />,
              );
            }}
            onUpdateClick={() => {
              openModal(
                <CreatePropertyDialog
                  name={prop.name}
                  type={prop.type}
                  value={prop.value}
                  initial={prop.initial}
                  onConfirm={async (name, type, value, initial) => {
                    const tid = toast.loading("Updating property...", {
                      icon: <Spinner />,
                    });
                    await updateProperty(
                      prop.name,
                      name,
                      type,
                      value,
                      initial,
                    );
                    await listProperties();
                    toast.success("Property updated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }}
                  onImageConfirm={async (name, imageDesc, image, isInitial) => {
                    const tid = toast.loading("Updating image property...", {
                      icon: <Spinner />,
                    });
                    await updateImageProperty(prop.name, prop.value, name,
                      imageDesc, image, isInitial);
                    await listProperties();
                    toast.success("Image property updated", {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }}
                />,
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
