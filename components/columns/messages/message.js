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
import { MoreHorizontalIcon } from '@hugeicons/react';
import { MESSAGE_STATUS } from '@/utils/const';
import HoverButton from '@/components/buttons/hover-button';
import Avatar from '@/components/common/avatar';
import { getImageIdByName } from '@/utils/utils';

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
  const avatar = state?.avatar?.[message.role] || {};
  const name = avatar.name || message.role;
  const image = getImageIdByName(avatar.imageName, components);

  return (
    <>
      {message.role !== 'divider' ? (
        <div className={`message ${message.role} ${playMode && 'play-mode'}`}>
          <Avatar image={image} name={name} size={36} className="text-lg" />
          <div className="message-body">
            <div className="flex justify-between -mb-4">
              <span className="flex gap-2">
                <span className="font-semibold">{name}</span>
                <span className="text-neutral-400">
                  {dayjs(message.updatedAt).fromNow(true)}
                </span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <HoverButton className="-mr-[9px]">
                    <MoreHorizontalIcon size={20} />
                  </HoverButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="rounded-2xl p-2 w-52"
                >
                  <DropdownMenuItem
                    disabled={
                      generating ||
                      (message.status &&
                        message.status !== MESSAGE_STATUS.error)
                    }
                    className="h-11 rounded-xl px-3 text-base"
                    onClick={() => restartFromMessageHandle(message.id)}
                  >
                    <div className="flex gap-2 justify-between w-full cursor-pointer">
                      Restart from here
                    </div>
                  </DropdownMenuItem>
                  {message.role === 'assistant' ? (
                    <DropdownMenuItem
                      disabled={
                        generating ||
                        (message.status &&
                          message.status !== MESSAGE_STATUS.error)
                      }
                      className="h-11 rounded-xl px-3 text-base"
                      onClick={() => regenerateMessageHandle(message.id)}
                    >
                      <div className="flex gap-2 justify-between w-full cursor-pointer">
                        Regenerate
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
