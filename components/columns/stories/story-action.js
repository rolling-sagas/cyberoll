'use client';
import toast from 'react-hot-toast/headless';

import { useModalStore } from '@/components/modal/dialog-placeholder';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import Alert from '@/components/modal/alert';

import Spinner from '../spinner';
import BaseButton from '@/components/buttons/base-button';

import { BubbleChatAddIcon, CheckmarkCircle01Icon } from '@hugeicons/react';
import CreateStoryDialog from './create-story-dialog';
import { parseError } from '@/utils/utils';
import {
  createStory,
  deleteStory,
  updateStory,
  copyStory,
} from '@/service/story';

export function AlertError(message) {
  const openAlert = useAlertStore.getState().open;

  openAlert(
    <Alert
      title="Oops, something wrong!"
      message={message}
      confirmLabel="OK"
    />
  );
}

export async function onDeleteClick(storyId, cb) {
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

export function onCreateClick(cb, router) {
  const openModal = useModalStore.getState().open;

  openModal(
    <CreateStoryDialog
      onConfirm={async (name, description, image) => {
        const tid = toast.loading('Creating story...', {
          icon: <Spinner />,
        });
        try {
          const res = await createStory({
            name,
            description,
            image,
          });
          if (typeof cb === 'function') {
            await cb();
          } else {
            router.push(`/st/${res.id}/edit`);
          }
        } catch (e) {
          console.error(e)
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
}

export function CreateStory ({ cb, router }) {
  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() => onCreateClick(cb, router)}
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

export const onPlayStory = (story, router) => {
  const openModal = useModalStore.getState().open;

  openModal(
    <CreateStoryDialog
      title="Play from this template"
      name={story.name + ' copy'}
      desc={story.description}
      image={story.image}
      onConfirm={async (name, description, image) => {
        const tid = toast.loading('Duplicating from the template', {
          icon: <Spinner />,
        });
        try {
          const res = await copyStory({
            ...story,
            name,
            description,
            image,
          });
          router.push('/st/' + res.id + '/edit');
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

export function onUpdateClick(story, cb) {
  const openModal = useModalStore.getState().open;

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
          await cb();
          toast.dismiss(tid);
        }
      }}
    />
  );
}

export function onDuplicateClick(story, router) {
  const openModal = useModalStore.getState().open;

  openModal(
    <CreateStoryDialog
      title="Duplicate story"
      name={story.name + ' copy'}
      desc={story.description}
      image={story.image}
      onConfirm={async (name, description, image) => {
        const tid = toast.loading('Duplicating story...', {
          icon: <Spinner />,
        });
        try {
          const res = await copyStory({
            ...story,
            name,
            description,
            image,
          });
          router.push('/st/' + res.id + '/edit');
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
}
