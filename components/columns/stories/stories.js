'use client';
import toast from 'react-hot-toast/headless';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useModalStore } from '@/components/modal/dialog-placeholder';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import Alert from '@/components/modal/alert';

import Spinner from '../spinner';
import BaseButton from '@/components/buttons/base-button';
import StoryItem from './story-item';

import { BubbleChatAddIcon, CheckmarkCircle01Icon } from '@hugeicons/react';
import CreateStoryDialog from './create-story-dialog';
import { parseError } from '@/utils/utils';
import {
  getStories,
  createStory,
  deleteStory,
  updateStory,
  copyStory,
} from '@/service/story';

function AlertError(message) {
  const openAlert = useAlertStore.getState().open;
  openAlert(
    <Alert
      title="Oops, something wrong!"
      message={message}
      confirmLabel="OK"
    />
  );
}

async function onDeleteClick(storyId, cb) {
  const openAlert = useAlertStore.getState().open;
  return openAlert(
    <Alert
      title="Delete story?"
      message="If you delete this story, 
      you won't be able to restore it."
      onConfirm={async () => {
        const tid = toast.loading('Deleting story...', {
          icon: <Spinner />,
        });
        try {
          await deleteStory(storyId);
          toast.success('Story deleted', {
            id: tid,
            icon: <CheckmarkCircle01Icon />,
          });
          await cb();
        } catch (e) {
          AlertError("Can't delete the story: " + parseError(e));
        } finally {
          toast.dismiss(tid);
        }
      }}
    />
  );
}

const CreateStory = function ({ listStories }) {
  const openModal = useModalStore((state) => state.open);

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(
            <CreateStoryDialog
              title={'Create story'}
              onConfirm={async (name, description, image) => {
                const tid = toast.loading('Creating story...', {
                  icon: <Spinner />,
                });
                try {
                  await createStory({
                    name,
                    description,
                    image,
                  });
                  toast.success('Story created', {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                  await listStories();
                } catch (e) {
                  AlertError('Can\'t create the story: ' + parseError(e));
                } finally {
                  toast.dismiss(tid);
                }
              }}
            />
          )
        }
      >
        <BubbleChatAddIcon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Start a story
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
};

export default function Stories() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const listStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStories();
      setStories(data.stories || []);
    } finally {
      setLoading(false);
    }
  }, []);

  const openModal = useModalStore((state) => state.open);

  useEffect(() => {
    listStories();
  }, []);

  const onEditStory = (story) => {
    router.push('/st/' + story.id + '/edit');
  };

  const onPlayStory = (story) => {
    openModal(
      <CreateStoryDialog
        title="Play from this template"
        name={story.name + ' copy'}
        desc={story.description}
        image={story.image}
        onConfirm={async (name, description) => {
          const tid = toast.loading('Duplicating from the template', {
            icon: <Spinner />,
          });
          try {
            const res = await copyStory({
              ...story,
              name,
              description
            });
            router.push('/st/' + res.id);
            toast.success('Story duplicated', {
              id: tid,
              icon: <CheckmarkCircle01Icon />,
            });
          } catch (e) {
            AlertError("Can't dulicate the story: " + parseError(e));
          } finally {
            toast.dismiss(tid);
          }
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">No story here.</div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateStoryDialog
                onConfirm={async (name, description, image) => {
                  const tid = toast.loading('Creating story...', {
                    icon: <Spinner />,
                  });
                  try {
                    await createStory({
                      name,
                      description,
                      image,
                    });
                    await listStories();
                  } catch (e) {
                    return toast.error('Story create failed!', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  }
                  toast.success('Story created', {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                }}
              />
            );
          }}
        />
      </div>
    );
  }

  return (
    <>
      <CreateStory listStories={listStories} />
      {stories.map((story) => (
        <StoryItem
          key={story.id}
          story={story}
          onPlayStory={onPlayStory}
          onEditClick={onEditStory}
          onUpdateClick={() => {
            openModal(
              <CreateStoryDialog
                name={story.name}
                desc={story.description}
                image={story.image}
                onConfirm={async (name, description, image) => {
                  const tid = toast.loading('Updating story...', {
                    icon: <Spinner />,
                  });
                  try {
                    await updateStory(story.id, {
                      name,
                      description,
                      image,
                    });
                    toast.success('Story updated', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't update the story: " + parseError(e));
                  } finally {
                    await listStories();
                    toast.dismiss(tid);
                  }
                }}
              />
            );
          }}
          onDuplicateClick={() => {
            openModal(
              <CreateStoryDialog
                title="Duplicate story"
                name={story.name + ' copy'}
                desc={story.description}
                image={story.image}
                onConfirm={async (name, description) => {
                  const tid = toast.loading('Duplicating story...', {
                    icon: <Spinner />,
                  });
                  try {
                    const res = await copyStory({
                      ...story,
                      name,
                      description
                    });
                    router.push('/st/' + res.id);
                    toast.success('Story duplicated', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't dulicate the story: " + parseError(e));
                  } finally {
                    toast.dismiss(tid);
                  }
                }}
              />
            );
          }}
          onDeleteClick={() => onDeleteClick(story.id, listStories)}
        />
      ))}
    </>
  );
}
