import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import HoverButton from '@/components/buttons/hover-button';
import Avatar from '@/components/common/avatar';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import { restartFromMessage } from '@/stores/actions/game';
import {
  delMessage,
  getLastMessageStateFromMid,
  startViewingMessage,
} from '@/stores/actions/message';
import { setModal } from '@/stores/actions/ui';
import useStore from '@/stores/editor';
import { MESSAGE_STATUS } from '@/utils/const';
import dayjs from '@/utils/day';
import { getImageIdByName } from '@/utils/utils';
import {
  CodeIcon,
  Delete02Icon,
  MoreHorizontalIcon,
  Rotate01Icon,
} from '@hugeicons/react';
import Link from 'next/link';
import MessageContent from './message-content';

function Message({ message, style = null }) {
  const confirm = useAlertStore((state) => state.confirm);
  const playMode = useStore((state) => state.playMode);
  const generating = useStore((state) => state.generating);
  const components = useStore((state) => state.components);

  try {
    if (!message || typeof message !== 'object') {
      console.error('Invalid message object:', message);
      return null;
    }

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

    const regenerateMessageHandle = (mid, needConfirm = true) => {
      if (needConfirm) {
        confirm({
          title: 'Regenerate message?',
          message: 'The messages below will be deleted permanently.',
          onConfirm: async () => {
            restartFromMessage(mid, true);
          },
          confirmLabel: 'Continue',
        });
      } else {
        restartFromMessage(mid, true);
      }
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

    if (message.role === 'divider') {
      return (
        <div
          key={message.id}
          className="divider message-item relative"
          style={style}
        >
          {typeof message.content === 'string'
            ? message.content
            : String(message.content)}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none absolute top-1/2 right-[15px] -translate-y-1/2">
              <HoverButton>
                <MoreHorizontalIcon size={20} />
              </HoverButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-52">
              <DropdownMenuItem
                disabled={generating}
                className="h-11 rounded-xl px-3 text-base"
                onClick={() => restartFromMessageHandle(message.id)}
              >
                <div className="flex gap-2 justify-between w-full cursor-pointer font-semibold">
                  Restart from here
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div
        className={`message-item message ${message.role} px-6 py-4 border-b-[0.5px] last:border-none`}
        style={style}
      >
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
                <HoverButton className="-mr-[9px] -mt-1.5">
                  <MoreHorizontalIcon size={20} />
                </HoverButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl p-2 w-52">
                <DropdownMenuItem
                  disabled={generating}
                  className="h-11 rounded-xl px-3 text-base"
                  onClick={() => restartFromMessageHandle(message.id)}
                >
                  <div className="flex gap-2 justify-between w-full cursor-pointer font-semibold">
                    Restart from here
                  </div>
                </DropdownMenuItem>
                {message.role === 'assistant' ? (
                  <DropdownMenuItem
                    disabled={generating}
                    className="h-11 rounded-xl px-3 text-base"
                    onClick={() => regenerateMessageHandle(message.id)}
                  >
                    <div className="flex gap-2 justify-between w-full cursor-pointer font-semibold">
                      Regenerate
                    </div>
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <MessageContent
            playMode={playMode}
            content={message.content}
            components={components}
          />
          <div className="action-buttons flex -ml-[9px] -mt-2">
            {message.role === 'assistant' && !message.status ? (
              <HoverButton
                onClick={() => regenerateMessageHandle(message.id)}
                title="Regenerate"
                className="action-view"
              >
                <Rotate01Icon type="sharp" size={20} />
              </HoverButton>
            ) : null}
            {playMode ? null : (
              <>
                <HoverButton
                  onClick={() => startViewingMessage(message)}
                  title="Source"
                >
                  <CodeIcon variant="solid" size={20} />
                </HoverButton>
                <HoverButton
                  onClick={() => handleDeleteMessage(message.id)}
                  title="Delete"
                >
                  <Delete02Icon size={20} />
                </HoverButton>
              </>
            )}
          </div>
          {message.status === MESSAGE_STATUS.error ? (
            <div className="flex flex-col gap-4 border-1 rounded-xl p-4 items-center">
              <span>Oops, something went wrong, please try again later.</span>
              <Button
                onClick={() => regenerateMessageHandle(message.id, false)}
                className="flex-none rounded-xl h-10"
              >
                Regenerate
              </Button>
            </div>
          ) : null}
          {message.status === MESSAGE_STATUS.outOfCredits ? (
            <div className="flex flex-col gap-4 border-1 rounded-xl p-4 items-center">
              <span>Oops, you ran out of credits.</span>
              <Link href="/plan">
                <Button className="flex-none rounded-xl h-10">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Message component:', error);
    return (
      <div className="message-item message error px-6 py-4 border-b-[0.5px]">
        <div className="message-body">
          <div className="text-red-500">
            Error rendering message: {error.message}
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
