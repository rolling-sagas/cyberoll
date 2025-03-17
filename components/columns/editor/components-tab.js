import { TabPanel } from "@headlessui/react";

import {
  updateComponent,
  setEditingComponent,
  startEditingComponent,
  delComponent,
} from "@/stores/actions/component";
import { js } from "js-beautify";

import { restart } from "@/stores/actions/game";
import ComponentList from "./components";
import useStore from "@/stores/editor";
import ComponentForm from "./component-form";
import { COMPONENT_TYPE } from '@/utils/const';
import { Button } from "@/app/components/ui/button";
import EditorModal from "@/components/editors/editor-modal";

const ComponentsTab = ({ isFuncTab = false }) => {
  const editingComponent = useStore((state) => state.editingComponent);
  const allComponents = useStore((state) => state.components);
  const components = allComponents.filter(comp => isFuncTab ? comp.type === COMPONENT_TYPE.Function : comp.type !== COMPONENT_TYPE.Function)

  const handleNewComponent = () => {
    startEditingComponent();
    if (isFuncTab) {
      setEditingComponent({
        type: COMPONENT_TYPE.Function
      })
    }
  };

  const handleSaveComponent = () => {
    updateComponent();
  };

  const handleCancelComponent = () => {
    setEditingComponent(null);
  };

  const handleFormat = () => {
    setEditingComponent({
      ...editingComponent,
      value: js(editingComponent.value, { indent_size: 2 }).trim(),
    });
  };

  return (
    <TabPanel className="h-full flex flex-col gap-4">
      <div className="flex gap-4">
        {!editingComponent ? (
          <>
            <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={handleNewComponent}>New</Button>
            <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={restart}>Restart</Button>
          </>
        ) : (
          <>
            {
              editingComponent?.type === COMPONENT_TYPE.Function ? <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={handleFormat}>Format</Button> : null
            }
            <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={handleCancelComponent}>Cancel</Button>
            <Button className="h-7 text-xs rounded-xl" disabled={!editingComponent.name} variant="outline" onClick={handleSaveComponent}>Save</Button>
          </>
        )}
      </div>
      {!editingComponent ? (
        <ComponentList
          editFunc={startEditingComponent}
          deleteFunc={delComponent}
          list={components}
        />
      ) : <ComponentForm isFuncTab={isFuncTab} />}
    </TabPanel>
  );
};

export default ComponentsTab;
