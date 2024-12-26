'use client';
import toast from 'react-hot-toast/headless';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useModalStore } from '@/components/modal/dialog-placeholder';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import Alert from '@/components/modal/alert';

import Spinner from '../spinner';
import PublicStoryItem from './public-story-item';

import { CheckmarkCircle01Icon } from '@hugeicons/react';
import CreateStoryDialog from './create-story-dialog';
import { parseError } from '@/components/utils';
import {
  getPublicStories,
  deleteStory,
  updateStory,
  copyStory,
} from '@/service/story';

export default function Stories() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const listStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPublicStories();
      setStories(data.stories || []);
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    listStories();
  }, []);

  const onEditStory = (story) => {
    router.push('/st/' + story.id);
  };

  const onPlayStory = (story) => {
    openModal(
      <CreateStoryDialog
        title="Play from this template"
        name={story.name + ' copy'}
        desc={story.description}
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
      </div>
    );
  }

  return (
    <>
      {stories.map((story) => (
        <PublicStoryItem
          key={story.id}
          story={story}
          onPlayStory={onPlayStory}
          onEditClick={onEditStory}
          onUpdateClick={() => {
            openModal(
              <CreateStoryDialog
                name={story.name}
                desc={story.description}
                onConfirm={async (name, description) => {
                  const tid = toast.loading('Updating story...', {
                    icon: <Spinner />,
                  });
                  try {
                    await updateStory(story.id, {
                      name,
                      description,
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
          onDeleteClick={async () => {
            openAlert(
              <Alert
                title="Delete story?"
                message="If you delete this story, 
                you won't be able to restore it."
                onConfirm={async () => {
                  const tid = toast.loading('Deleting story...', {
                    icon: <Spinner />,
                  });
                  try {
                    await deleteStory(story.id);
                    toast.success('Story deleted', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                    await listStories();
                  } catch (e) {
                    AlertError("Can't delete the story: " + parseError(e));
                  } finally {
                    toast.dismiss(tid);
                  }
                }}
              />
            );
          }}
        />
      ))}
    </>
  );
}
