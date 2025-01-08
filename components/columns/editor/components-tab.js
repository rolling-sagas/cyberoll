import { TabPanel } from "@headlessui/react";

import {
  updateComponent,
  setEditingComponent,
  startEditingComponent,
  delComponent,
} from "@/stores/actions/component";

import { restart } from "@/stores/actions/game";

import ScriptEditor from "./script-editor";
import ComponentList from "./components";
import useStore from "@/stores/editor";

const ComponentsTab = () => {
  const editingComponent = useStore((state) => state.editingComponent);
  const components = useStore((state) => state.components);

  const handleNewComponent = () => {
    startEditingComponent();
  };

  const handleSaveComponent = () => {
    updateComponent();
    setEditingComponent(null);
  };

  const handleCancelComponent = () => {
    setEditingComponent(null);
  };

  const handleFormat = () => {};

  return (
    <TabPanel className="h-full flex flex-col gap-4">
      <div className="flex gap-4">
        {!editingComponent ? (
          <>
            <button className="btn-default" onClick={handleNewComponent}>New</button>
            <button className="btn-default" onClick={restart}>Restart</button>
          </>
        ) : (
          <>
            <button className="btn-default" onClick={handleFormat}>Format</button>
            <button className="btn-default" onClick={handleSaveComponent}>Save</button>
            <button className="btn-default" onClick={handleCancelComponent}>Cancel</button>
          </>
        )}
      </div>
      {!editingComponent ? (
        <ComponentList
          editFunc={startEditingComponent}
          deleteFunc={delComponent}
          list={components}
        />
      ) : (
        <>
          <input
            className="input-name"
            value={editingComponent?.name}
            placeholder="Unique component name"
            onChange={(evt) => {
              setEditingComponent({
                name: evt.target.value,
                value: editingComponent.value,
              });
            }}
          />
          <ScriptEditor
            code={editingComponent?.value}
            onChange={(value) => {
              setEditingComponent({
                name: editingComponent.name,
                value: value,
              });
            }}
            lang="toml"
          />
        </>
      )}
    </TabPanel>
  );
};

export default ComponentsTab;
