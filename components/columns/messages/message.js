import useStore from '@/stores/editor';
import { delMessage, startViewingMessage } from '@/stores/actions/message';
import { setModal } from '@/stores/actions/ui';
import {
  restartFromMessage,
  getLastMessageStateFromMid,
} from '@/stores/actions/game';
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

function Message({ message }) {
  const confirm = useAlertStore((state) => state.confirm);

  const playMode = useStore((state) => state.playMode);
  const generating = useStore((state) => state.generating);

  const components = useStore((state) => state.components);

  const restartFromMessageHandle = (mid) => {
    confirm({
      title: 'Restart from here?',
      message: 'The messages below will be deleted permanently.',
      onConfirm: async () => {
        restartFromMessage(mid);
      },
      confirmLabel: 'Continue',
    });
  };

  const regenerateMessageHandle = (mid) => {
    confirm({
      title: 'Regenerate message?',
      message: 'The messages below will be deleted permanently.',
      onConfirm: async () => {
        restartFromMessage(mid, true);
      },
      confirmLabel: 'Continue',
    });
  };

  function handleDeleteMessage(id) {
    setModal({
      title: 'Delete Message',
      description: `Are you sure you want to delete this message?`,
      confirm: { label: 'Delete', action: () => delMessage(id) },
      cancel: { label: 'Cancel' },
    });
  }

  const state = getLastMessageStateFromMid(message.id);
  const name = state?.avatar?.[message.role]?.name || message.role;
  const firstLetter = name?.substr(0, 1);

  return (
    <>
      {message.role !== 'divider' ? (
        <div className={`message ${message.role} ${playMode && 'play-mode'}`}>
          <div data-chr={firstLetter} className="role"></div>
          <div className="message-body">
            <div className="flex justify-between -mb-2">
              <span className="flex gap-2">
                <span className="font-semibold">{name}</span>
                <span className="text-neutral-400">
                  {dayjs(message.updatedAt).fromNow(true)}
                </span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontalIcon size={20} className="text-gray-800" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={generating}
                    className="h-10"
                    onClick={() => restartFromMessageHandle(message.id)}
                  >
                    <div className="flex gap-2 justify-between w-full cursor-pointer">
                      Restart from here
                      <ArrowRightDoubleIcon
                        variant="stroke"
                        type="sharp"
                        size={18}
                      />
                    </div>
                  </DropdownMenuItem>
                  {message.role === 'assistant' ? (
                    <DropdownMenuItem
                      disabled={generating}
                      className="h-10"
                      onClick={() => regenerateMessageHandle(message.id)}
                    >
                      <div className="flex gap-2 justify-between w-full cursor-pointer">
                        Regenerate
                        <ArrowRightDoubleIcon
                          variant="stroke"
                          type="sharp"
                          size={18}
                        />
                      </div>
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <MessageContent content={message.content} components={components} />
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
      )}
    </>
  );
}

export default Message;
