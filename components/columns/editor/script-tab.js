import { TabPanel } from "@headlessui/react";
import { restart, exportTemplate, importTemplate } from '@/stores/actions/game';
import { setScript } from "@/stores/actions/ui";
import { js } from "js-beautify";

import useStore from '@/stores/editor'

import ScriptEditor from "./script-editor";

const ScriptTab = () => {
  const script = useStore((state) => state.script);
  const handleFormat = () => setScript(js(script, { indent_size: 2 }).trim());

  return (
    <TabPanel className="h-full flex flex-col gap-4">
      <div className="flex gap-4">
        <button className="btn-default" onClick={handleFormat}>
          Format
        </button>
        <button className="btn-default" onClick={restart}>
          Restart
        </button>
        <button className="btn-default" onClick={importTemplate}>
          Import
        </button>
        <button className="btn-default" onClick={exportTemplate}>
          Export
        </button>
      </div>
      <ScriptEditor code={script} onChange={setScript} lang="js" />
    </TabPanel>
  );
};

export default ScriptTab;
