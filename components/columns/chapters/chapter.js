import toast from 'react-hot-toast/headless';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createStore, useStore } from 'zustand';
import Spinner from '../spinner';
import BaseButton from '@/components/buttons/base-button';
import { useModalStore } from '@/components/modal/dialog-placeholder';
import CreateMessageDialog from './create-message-dialog';
import CreateChapterDialog from './create-chapter-dialog';
import { createComponentStore } from '@/components/columns/components/components';
import {
  getMessage,
  getMessages,
  createMessage,
  copyMessage,
  deleteMessage,
  updateMessage,
  setEntryMessage,
} from '@/service/message';
import { azure } from '@/service/ai';
import { updateComponentsWithName } from '@/service/component'

import { copyChapter, resetChapter } from '@/service/chapter';
import { formatMessages } from '@/utils/utils';

const createChapterStore = (data) =>
  createStore((set, get) => ({
    id: data.id,
    name: data.name,
    generate: async (newMessages, update) => {
      if (newMessages && newMessages.length > 0) {
        set({
          messages: [
            ...newMessages.map((m, idx) => {
              m.id = idx + 512;
              m.content = JSON.stringify(m.content);
              return m;
            }),
            ...get().messages,
          ],
        });
      }

      const response = await fetch('/api/chapter/' + data.id + '/generate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          llm: 'azure',
          cache: true,
          messages: newMessages,
          update: update,
        }),
      });

      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
      return res;
    },

    regenerate: async (mid) => {
      const response = await fetch(
        '/api/chapter/' + data.id + '/message/' + mid + '/regenerate',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ llm: 'azure', cache: false }),
        }
      );
      const res = await response.json();
      if (res.error) {
        throw res.error;
      }
      return res;
    },
  }));

import {
  AiChat02Icon,
  BubbleChatAddIcon,
  CheckmarkCircle01Icon,
  Copy01Icon,
  MoreHorizontalIcon,
  RefreshIcon,
  ViewIcon,
  ViewOffIcon,
} from '@hugeicons/react';

import MessageItem from './message-item';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import Alert from '@/components/modal/alert';
import { useColumnsStore } from '@/components/columns/pinned-columns';
import Components from '../components/components';
import CircleIconButton from '@/components/buttons/circle-icon-button';
import {
  ItemMenuButton,
  MenuButtonDivider,
  MenuButtonItem,
} from '@/components/buttons/menu-button';
import { parseError } from '@/utils/utils';

export default function Chapter({ data }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const listMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMessages(data.id);
      setMessages((res.messages || []).reverse());
      return res.messages;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    listMessages();
  }, []);

  const storeRef = useRef(createChapterStore(data));

  const openModal = useModalStore((state) => state.open);
  const openAlert = useAlertStore((state) => state.open);

  function AlertError(message) {
    openAlert(
      <Alert
        title="Oops, something wrong!"
        message={message}
        confirmLabel="OK"
      />
    );
  }

  const generate = useStore(storeRef.current, (state) => state.generate);
  const regenerate = useStore(storeRef.current, (state) => state.regenerate);

  const addColumn = useColumnsStore((state) => state.addColumn);
  const rmColumn = useColumnsStore((state) => state.rmColumn);
  const setHeader = useColumnsStore((state) => state.setHeader);
  const propsStore = useRef(createComponentStore(data.id));

  const components = useStore(propsStore.current, (state) => state.components);

  const listComponents = useStore(
    propsStore.current,
    (state) => state.listComponents
  );

  const resetComponents = useStore(
    propsStore.current,
    (state) => state.resetComponents
  );

  const bottom = useRef(null);

  function scrollToBottom() {
    setTimeout(
      () => bottom.current?.scrollIntoView({ behavior: 'smooth' }),
      10
    );
  }

  const [showComponents, setShowComponents] = useState(true);

  useEffect(() => {
    if (showComponents) {
      addColumn(
        'components',
        {
          headerCenter: 'Components',
          headerRight: (
            <ItemMenuButton
              btn={<CircleIconButton icon={<MoreHorizontalIcon size={12} />} />}
            >
              <MenuButtonItem
                left="Reset"
                className="text-rs-red"
                right={<RefreshIcon />}
                onClick={() => {
                  openAlert(
                    <Alert
                      title="Reset all components"
                      message="Reset all components' value."
                      confirmLabel="OK"
                      onConfirm={async () => {
                        const tid = toast.loading('Reseting components...', {
                          icon: <Spinner />,
                        });
                        try {
                          await resetComponents();
                          toast.success('Components updated', {
                            id: tid,
                            icon: <CheckmarkCircle01Icon />,
                          });
                          await listComponents();
                        } catch (e) {
                          toast.dismiss(tid);
                          AlertError("Can't reset: " + parseError(e));
                        }
                      }}
                    />
                  );
                }}
              />
            </ItemMenuButton>
          ),
        },
        <Components storeRef={propsStore} />
      );
    } else {
      rmColumn('components');
    }

    setHeader('chapter', {
      headerRight: (
        <ItemMenuButton
          btn={<CircleIconButton icon={<MoreHorizontalIcon size={12} />} />}
        >
          <MenuButtonItem
            left={showComponents ? 'Hide components' : 'Show components'}
            right={showComponents ? <ViewOffIcon /> : <ViewIcon />}
            onClick={() => {
              setShowComponents(!showComponents);
            }}
          />
          <MenuButtonItem
            left="Duplicate"
            right={<Copy01Icon />}
            onClick={() => {
              openModal(
                <CreateChapterDialog
                  title="Duplicate chapter"
                  data={{
                    name: data.name + ' copy',
                    description: data.description,
                  }}
                  onConfirm={async (ch) => {
                    const tid = toast.loading('Duplicating chapter...', {
                      icon: <Spinner />,
                    });

                    try {
                      const res = await copyChapter({
                        ...data,
                        ...ch,
                      });
                      toast.success('Chapter duplicated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                      router.push('/ch/' + res.id);
                    } catch (e) {
                      toast.dismiss(tid);
                      AlertError(
                        "Can't duplicate the chapter: " + parseError(e)
                      );
                    } finally {
                    }
                  }}
                />
              );
            }}
          />
          <MenuButtonDivider />
          <MenuButtonItem
            className="text-rs-red"
            left={'Reset'}
            right={<RefreshIcon />}
            onClick={() => {
              openAlert(
                <Alert
                  title="Reset chapter"
                  message={
                    'Remove all messages after the entry point, ' +
                    'and set all components to initial value.'
                  }
                  confirmLabel="OK"
                  onConfirm={async () => {
                    const tid = toast.loading('Reseting chapter...', {
                      icon: <Spinner />,
                    });
                    try {
                      await resetChapter(data.id);
                      toast.success('Chapter reset', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                      await listMessages();
                      await listComponents();
                      scrollToBottom();
                    } catch (e) {
                      toast.dismiss(tid);
                      AlertError("Can't reset chapter: " + parseError(e));
                    }
                  }}
                />
              );
            }}
          />
        </ItemMenuButton>
      ),
    });
  }, [addColumn, rmColumn, showComponents, data.id]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No messages here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateMessageDialog
                onConfirm={async (role, content, autoGen) => {
                  const tid = toast.loading('Creating message...', {
                    icon: <Spinner />,
                  });
                  try {
                    await createMessage(data.id, role, content);
                    const msgs = await listMessages();
                    scrollToBottom();
                    if (autoGen) {
                      toast.loading('Generating...', {
                        id: tid,
                        icon: <Spinner />,
                      });
                      // await generate();
                      await azure(formatMessages(msgs, components));
                      for (let m of arr) {
                        await createMessage(data.id, 'assistant', m);
                      }
                      toast.success('Message generated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                      await listMessages();
                      scrollToBottom();
                    } else {
                      toast.success('Message created', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    }
                  } catch (e) {
                    toast.dismiss(tid);
                    AlertError("Can't create message: " + parseError(e));
                  }
                }}
              />
            );
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col-reverse overflow-y-auto">
        <div ref={bottom}></div>
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            isFirst={msg.id === messages[0].id}
            message={msg}
            components={components}
            onCall={async (c) => {
              scrollToBottom();
              const tid = toast.loading('Generating...', {
                icon: <Spinner />,
              });

              try {
                // console.log("update", c.update)
                console.log('[oncall]', c)
                await createMessage(data.id, 'user', c.send[0]);
                // const res = await generate(
                //   [
                //     {
                //       role: 'user',
                //       content: { data: c.send },
                //     },
                //   ],
                //   c.update
                // );
                const { data: arr = [] } = await azure(
                  formatMessages([...messages].reverse().concat([{
                    role: 'user',
                    content: JSON.stringify({ data: c.send }),
                  }]), components, undefined, c.update)
                );
                for (let m of arr) {
                  await createMessage(data.id, 'assistant', m);
                }
                if (c.update) {
                  await updateComponentsWithName(data.id, c.update)
                  await listComponents();
                }
                await listMessages();
                scrollToBottom();
                toast.success('Generated', {
                  id: tid,
                  icon: <CheckmarkCircle01Icon />,
                });
              } catch (e) {
                console.error(e)
                openAlert(
                  <Alert
                    title="Oops, something wrong!"
                    message={(e.error?.message || e.toString) + ', please try it later.'}
                    confirmLabel="OK"
                  />
                );
              }
            }}
            onDeleteClick={(below) => {
              if (below) {
                openAlert(
                  <Alert
                    title="Delete messages?"
                    message="If you delete all the messages, 
                you won't be able to restore them."
                    onConfirm={async () => {
                      const tid = toast.loading('Deleting messages...', {
                        icon: <Spinner />,
                      });
                      await deleteMessage(msg.id, true);
                      await listMessages();
                      toast.success('Messages deleted', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    }}
                  />
                );
              } else {
                openAlert(
                  <Alert
                    title="Delete message?"
                    message="If you delete this message, 
                you won't be able to restore it."
                    onConfirm={async () => {
                      const tid = toast.loading('Deleting message...', {
                        icon: <Spinner />,
                      });
                      await deleteMessage(msg.id);
                      await listMessages();
                      toast.success('Message deleted', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    }}
                  />
                );
              }
            }}
            onUpdateClick={() => {
              openModal(
                <CreateMessageDialog
                  role={msg.role}
                  content={msg.content}
                  onConfirm={async (role, content) => {
                    const tid = toast.loading('Updating message...', {
                      icon: <Spinner />,
                    });
                    try {
                      await updateMessage(msg.id, role, content);
                      await listMessages();
                      toast.success('Message updated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    } finally {
                      toast.dismiss(tid);
                    }
                  }}
                />
              );
            }}
            onGenerateClick={async () => {
              const tid = toast.loading('Regenerating message...', {
                icon: <Spinner />,
              });
              // await regenerate(msg.id);
              const { data: arr = [] } = await azure(
                formatMessages([...messages].reverse(), components, msg.id),
                true
              );
              const newM = arr && arr[0];
              await updateMessage(msg.id, msg.role, JSON.stringify(newM));
              await listMessages();
              toast.success('Message regenerated', {
                id: tid,
                icon: <CheckmarkCircle01Icon />,
              });
            }}
            onEntryClick={async () => {
              const tid = toast.loading('Set the message as entry...', {
                icon: <Spinner />,
              });
              await setEntryMessage(msg.id);
              await listMessages();
              toast.success('Done', {
                id: tid,
                icon: <CheckmarkCircle01Icon />,
              });
            }}
          />
        ))}
      </div>

      <div className="w-full px-6 border-b">
        <div
          className="flex flex-row py-4 items-center"
          onClick={() =>
            openModal(
              <CreateMessageDialog
                onConfirm={async (role, content, autoGen) => {
                  const tid = toast.loading('Creating message...', {
                    icon: <Spinner />,
                  });
                  try {
                    await createMessage(data.id, role, content);
                    const msgs = await listMessages();
                    // console.log(role, content, autoGen);
                    if (autoGen) {
                      // await generate();
                      const { data: arr = [] } = await azure(
                        formatMessages(msgs, components)
                      );
                      for (let m of arr) {
                        await createMessage(data.id, 'assistant', m);
                      }

                      toast.success('Generating message...', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                      await listMessages();
                      toast.success('Message generated', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    } else {
                      await listMessages();
                      toast.success('Message created', {
                        id: tid,
                        icon: <CheckmarkCircle01Icon />,
                      });
                    }
                  } catch (e) {
                    if (e.error) {
                      openAlert(
                        <Alert
                          title="Oops, something wrong!"
                          message={e.error.message + ', please try it later.'}
                          confirmLabel="OK"
                        />
                      );
                    } else {
                      AlertError(e);
                    }
                  }
                }}
              />
            )
          }
        >
          <BubbleChatAddIcon
            className="text-rs-text-secondary"
            strokeWidth={1}
          />
          <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
            Create a new message
          </div>
          <BaseButton
            label={<AiChat02Icon />}
            onClick={async (evt) => {
              evt.stopPropagation();

              const tid = toast.loading('Generating...', {
                icon: <Spinner />,
              });

              try {
                // await generate();
                const { data: arr = [] } = await azure(
                  formatMessages([...messages].reverse(), components)
                );
                console.log('ai res', arr);
                for (let m of arr) {
                  await createMessage(data.id, 'assistant', m);
                }
              } catch (e) {
                AlertError(e);
              } finally {
                toast.loading('Fetching messages', {
                  id: tid,
                  icon: <Spinner />,
                });
                await listMessages();
                scrollToBottom();
              }

              toast.success('Message generated', {
                id: tid,
                icon: <CheckmarkCircle01Icon />,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
