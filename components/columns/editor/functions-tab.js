import { TabPanel } from "@headlessui/react";
import { js } from "js-beautify";

import {
  delFunction,
  setEditingFunction,
  startEditingFunction,
  updateFunction,
} from "@/stores/actions/function";

import { restart } from "@/stores/actions/game";

import ScriptEditor from "./script-editor";
import ComponentList from "./components";
import useStore from "@/stores/editor";

const FunctionsTab = () => {
  const editingFunction = useStore((state) => state.editingFunction);
  const functions = useStore((state) => state.functions);

  const handleNewComponent = () => {
    startEditingFunction();
  };

  const handleSaveComponent = () => {
    updateFunction();
    setEditingFunction(null);
  };

  const handleCancelComponent = () => {
    setEditingFunction(null);
  };

  const handleFormat = () => {
    setEditingFunction({
      name: editingFunction.name,
      value: js(editingFunction.value, { indent_size: 2 }).trim(),
    });
  };

  return (
    <TabPanel className="h-full flex flex-col gap-4">
      <div className="flex gap-4">
        {!editingFunction ? (
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
      {!editingFunction ? (
        <ComponentList
          deleteFunc={delFunction}
          editFunc={startEditingFunction}
          list={functions}
        />
      ) : (
        <>
          <input
            className="input-name"
            value={editingFunction?.name}
            placeholder="Unique function name"
            onChange={(evt) => {
              setEditingFunction({
                name: evt.target.value,
                value: editingFunction.value,
              });
            }}
          />
          <ScriptEditor
            code={editingFunction?.value}
            onChange={(value) => {
              setEditingFunction({
                name: editingFunction.name,
                value: value,
              });
            }}
            lang="javascript"
          />
        </>
      )}
    </TabPanel>
  );
};

export default FunctionsTab;
