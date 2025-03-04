import './messages.css';
import useStore from '@/stores/editor';
import { delMessage, startViewingMessage } from '@/stores/actions/message';
import { setModal } from '@/stores/actions/ui';
import { onUserAction, restartFromMessage } from '@/stores/actions/game';
import { setDiceBox, clearRoll } from '@/stores/actions/dice';
import MessageContent from './message-content';
import dayjs from '@/utils/day';
import { useAlertStore } from '@/components/modal/alert-placeholder';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { MoreHorizontalIcon, ArrowRightDoubleIcon } from '@hugeicons/react';

import { useRef, useEffect } from 'react';

function Messages() {
  const bottomEl = useRef(null);

  const confirm = useAlertStore(state => state.confirm)

  const messages = useStore((state) => state.messages);
  const playMode = useStore((state) => state.playMode);
  const generating = useStore((state) => state.generating)

  const diceBoxRef = useRef(null);
  const rolling = useStore((state) => state.rolling);
  const lastRoll = useStore((state) => state.lastRoll);
  const components = useStore((state) => state.components);

  const restartFromMessageHandle = (mid) => {
    confirm({
      title: 'Restart from here?',
      message: 'The messages below will be deleted permanently.',
      onConfirm: async () => {
        restartFromMessage(mid)
      },
      confirmLabel: 'Continue',
    })
  }

  const regenerateMessageHandle = (mid) => {
    confirm({
      title: 'Regenerate message?',
      message: 'The messages below will be deleted permanently.',
      onConfirm: async () => {
        restartFromMessage(mid, true)
      },
      confirmLabel: 'Continue',
    })
  }

  useEffect(() => {
    if (diceBoxRef.current) {
      const canvas = diceBoxRef.current.getElementsByTagName('canvas');
      if (canvas.length === 0) {
        console.log('refreshed...', diceBoxRef.current);
        setDiceBox(diceBoxRef.current);
      }
    }
  }, [diceBoxRef.current]);

  function handleDeleteMessage(id) {
    setModal({
      title: 'Delete Message',
      description: `Are you sure you want to delete this message?`,
      confirm: { label: 'Delete', action: () => delMessage(id) },
      cancel: { label: 'Cancel' },
    });
  }

  const scrollToBottom = () => {
    bottomEl.current?.scrollIntoView();
  };

  useEffect(() => {
    console.log('[messages]', messages);
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      <div className="message-container">
        <div className="flex flex-col gap-6">
          {messages?.map((message) =>
            message.role !== 'divider' ? (
              <div
                className={`message ${message.role} ${playMode && 'play-mode'}`}
                key={message.id}
              >
                <div className={`role`}></div>
                <div className="message-body">
                  <div className="flex justify-between -mb-2">
                    <span className="flex gap-2">
                      <span className="font-semibold">{message.role}</span>
                      <span className="text-neutral-400">
                        {dayjs(message.updatedAt).fromNow(true)}
                      </span>
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontalIcon
                          size={20}
                          className="text-gray-800"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled={generating} className="h-10" onClick={() => restartFromMessageHandle(message.id)}>
                          <div className="flex gap-2 justify-between w-full cursor-pointer">
                            Restart from here
                            <ArrowRightDoubleIcon variant='stroke' type='sharp' size={18} />
                          </div>
                        </DropdownMenuItem>
                        {
                          message.role === 'assistant' ? (
                            <DropdownMenuItem disabled={generating} className="h-10" onClick={() => regenerateMessageHandle(message.id)}>
                              <div className="flex gap-2 justify-between w-full cursor-pointer">
                                Regenerate
                                <ArrowRightDoubleIcon variant='stroke' type='sharp' size={18} />
                              </div>
                            </DropdownMenuItem>
                          ) : null
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <MessageContent
                    content={message.content}
                    components={components}
                  />
                  <div className="action-buttons gap-4 flex">
                    <button
                      className="btn-default"
                      onClick={() => startViewingMessage(message)}
                    >
                      Source
                    </button>
                    <button
                      className="btn-default"
                      onClick={() => handleDeleteMessage(message.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div key={message.id} className="divider">
                {message.content}
              </div>
            )
          )}
        </div>
        <div ref={bottomEl} className="message-tail"></div>
      </div>
      <div
        ref={diceBoxRef}
        id="dice-box"
        className={`dice-box ${rolling > 0 ? 'active' : ''}`}
        onClick={async () => {
          if (rolling === 2) {
            await clearRoll();
            onUserAction({ name: 'roll', params: lastRoll });
          }
        }}
      >
        {lastRoll?.value && (
          <div className="roll-result">
            <div className="number">{lastRoll.value}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
