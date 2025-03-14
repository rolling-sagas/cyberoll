import { TabPanel } from "@headlessui/react";
import { restart, exportTemplate, importTemplate } from '@/stores/actions/game';
import { setScript } from "@/stores/actions/ui";
import { js } from "js-beautify";
import { Button } from "@/app/components/ui/button";

import useStore from '@/stores/editor'

import ScriptEditor from "./script-editor";

const ScriptTab = () => {
  const script = useStore((state) => state.script);
  const handleFormat = () => setScript(js(script, { indent_size: 2 }).trim());

  return (
    <TabPanel className="h-full flex flex-col gap-4">
      <div className="flex gap-4">
        <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={handleFormat}>
          Format
        </Button>
        <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={restart}>
          Restart
        </Button>
        <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={importTemplate}>
          Import
        </Button>
        <Button className="h-7 text-xs rounded-xl" variant="outline" onClick={exportTemplate}>
          Export
        </Button>
      </div>
      <ScriptEditor code={script} onChange={setScript} lang="js" />
    </TabPanel>
  );
};

export default ScriptTab;
