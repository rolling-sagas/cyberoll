import { TabPanel } from '@headlessui/react';
import { restart, exportTemplate, importTemplate } from '@/stores/actions/game';
import { setScript } from '@/stores/actions/ui';
import { js } from 'js-beautify';
import { Button } from '@/app/components/ui/button';

import useStore from '@/stores/editor';

import Editor from '@/components/editors/editor';
import EditorModal from '@/components/editors/editor-modal';
import { useModalStore } from '@/components/modal/dialog-placeholder';

const ScriptTab = () => {
  const script = useStore((state) => state.script);
  const handleFormat = () => setScript(js(script, { indent_size: 2 }).trim());
  const openModal = useModalStore((state) => state.open);

  return (
    <TabPanel className="h-full flex flex-col gap-4 outline-none">
      <div className="flex gap-4">
        <Button
          className="h-7 text-xs rounded-xl"
          variant="outline"
          onClick={handleFormat}
        >
          Format
        </Button>
        <Button
          className="h-7 text-xs rounded-xl"
          variant="outline"
          onClick={restart}
        >
          Restart
        </Button>
        <Button
          className="h-7 text-xs rounded-xl"
          variant="outline"
          onClick={importTemplate}
        >
          Import
        </Button>
        <Button
          className="h-7 text-xs rounded-xl"
          variant="outline"
          onClick={exportTemplate}
        >
          Export
        </Button>
      </div>
      <Editor
        onClick={() =>
          openModal(
            <EditorModal
              value={script}
              title="Scripting"
              onSave={(v) => setScript(v)}
              titleReadOnly
            />
          )
        }
        code={script}
        lang="javascript"
        readOnly
      />
    </TabPanel>
  );
};

export default ScriptTab;
