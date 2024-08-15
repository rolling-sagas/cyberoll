import { createStore, useStore } from "zustand";
import Spinner from "../spinner";
import { useRef, useEffect } from "react";

import { useModalStore } from "@/components/modal/dialog-placeholder";
import { useAlertStore } from "@/components/modal/alert-placeholder";
import BaseButton from "@/components/buttons/base-button";
import Alert from "@/components/modal/alert";

import CreatePropertyDialog from "./create-property-dialog";
import { toast } from "react-hot-toast/headless";
import { BubbleChatAddIcon, CheckmarkCircle01Icon } from "@hugeicons/react";
import PropertyItem from "./property-item";

const createPropertyStore = (id) =>
  createStore((set) => ({
    id: id,

    loading: "pending",

    properties: [],

    listProperties: async () => {
      const response = await fetch(`/api/session/${id}/property`);
      const properties = await response.json();
      set({ properties, loading: "loaded" });
      // console.log("messages", data.id, messages);
    },

    newProperty: async (name, type, value, imageDesc, image) => {
      if (type === "image") {
        // console.log("upload image");
        const formData = new FormData();

        formData.append("desc", imageDesc);
        formData.append("name", name);
        formData.append("file", image);
        const response = await fetch(`/api/session/${id}/property`, {
          method: "PUT",
          body: formData,
        });
        const res = await response.json();
        console.log(res);
      } else {
        const response = await fetch(`/api/session/${id}/property`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ data: { name, type, value } }),
        });
        const res = await response.json();
        console.log(res);
      }
    },

    updateProperty: async (oldName, name, type, value, imageDesc, image) => {
      if (type === "image") {
        const formData = new FormData();

        formData.append("name", name);
        if (imageDesc) {
          formData.append("desc", imageDesc);
        }

        if (image) {
          console.log("upload image");
          formData.append("file", image);
        }
        formData.append("value", value);
        const response = await fetch(`/api/session/${id}/property/${oldName}`, {
          method: "PUT",
          body: formData,
        });
        const res = await response.json();
        // console.log(res);
      } else {
        const response = await fetch(
          "/api/session/" + id + "/property/" + oldName,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              data: { name, type, value },
            }),
          },
        );
        const res = await response.json();
        // console.log(message);
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
      console.log(res);
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
      // const res = await response.json();
      console.log(response);
    },
  }));

function CreateProperty({ store }) {
  const openModal = useModalStore((state) => state.open);

  const newProperty = useStore(store, (state) => state.newProperty);

  const listProperties = useStore(store, (state) => state.listProperties);

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(
            <CreatePropertyDialog
              onConfirm={async (name, type, value, imageDesc, image) => {
                const tid = toast.loading("Creating property...", {
                  icon: <Spinner />,
                });
                await newProperty(name, type, value, imageDesc, image);
                await listProperties();
                toast.success("Property created", {
                  id: tid,
                  icon: <CheckmarkCircle01Icon />,
                });
              }}
            />,
          )
        }
      >
        <BubbleChatAddIcon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Create a property
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
}

export default function Properties({ id, onPropsUpdate }) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = createPropertyStore(id);
  }

  const openModal = useModalStore((state) => state.open);
  const openAlert = useAlertStore((state) => state.open);

  const properties = useStore(storeRef.current, (state) => state.properties);
  const loading = useStore(storeRef.current, (state) => state.loading);

  const listProperties = useStore(
    storeRef.current,
    (state) => state.listProperties,
  );

  const newProperty = useStore(storeRef.current, (state) => state.newProperty);

  const deleteProperty = useStore(
    storeRef.current,
    (state) => state.deleteProperty,
  );

  const updateProperty = useStore(
    storeRef.current,
    (state) => state.updateProperty,
  );

  useEffect(() => {
    if (listProperties) {
      listProperties();
    }
  }, [listProperties]);

  useEffect(() => {
    if (onPropsUpdate && properties && updateProperty) {
      onPropsUpdate({ properties, updateProperty });
    }
  }, [onPropsUpdate, properties, updateProperty]);

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
                onConfirm={async (name, type, value, imageDesc, image) => {
                  const tid = toast.loading("Creating property...", {
                    icon: <Spinner />,
                  });
                  await newProperty(name, type, value, imageDesc, image);
                  await listProperties();
                  toast.success("Property created", {
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
                onConfirm={async (name, type, value, imageDesc, image) => {
                  const tid = toast.loading("Updating property...", {
                    icon: <Spinner />,
                  });
                  await updateProperty(
                    prop.id,
                    name,
                    type,
                    value,
                    imageDesc,
                    image,
                  );
                  await listProperties();
                  toast.success("Property updated", {
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
  );
}
