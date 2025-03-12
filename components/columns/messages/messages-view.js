'use client';

import useStore from '@/stores/editor';

import { setAutoGenerate, setPlayMode } from '@/stores/actions/ui';
import { startViewingMessage } from '@/stores/actions/message';
import { generate } from '@/stores/actions/game';

import Messages from './messages';
import ScriptEditor from '../editor/script-editor';
import Checkbox from './checkbox';
import { Button } from '@/app/components/ui/button';

export default function MessagesView({ isSession = false, resetHandle }) {
  const autoGenerate = useStore((state) => state.autoGenerate);
  const playMode = useStore((state) => state.playMode);
  const viewingMessage = useStore((state) => state.viewingMessage);
  const generating = useStore((state) => state.generating);

  return (
    <div className="flex-auto flex flex-col gap-4 px-6 pt-2 pb-4">
      {isSession ? null : <div className="font-semibold">Messages</div>}
      {isSession ? null : (
        <div className="flex flex-row gap-4">
          {!viewingMessage ? (
            <>
              <Checkbox
                label="Auto generate"
                checked={autoGenerate}
                onChange={setAutoGenerate}
              />
              {isSession ? null : (
                <Checkbox
                  label="Play mode"
                  checked={playMode}
                  onChange={setPlayMode}
                />
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={generating}
                onClick={() => generate()}
              >
                Generate
              </Button>
              {resetHandle ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={generating}
                  onClick={resetHandle}
                >
                  Restart
                </Button>
              ) : null}
            </>
          ) : (
            <button onClick={() => startViewingMessage(null)}>Back</button>
          )}
        </div>
      )}
      {!viewingMessage ? (
        <Messages />
      ) : (
        <ScriptEditor
          code={
            typeof viewingMessage.content === 'object'
              ? JSON.stringify(viewingMessage.content, null, 2)
              : viewingMessage.content
          }
          onChange={() => {}}
          lang={typeof viewingMessage.content === 'object' ? 'json' : 'plain'}
        />
      )}
    </div>
  );
}
