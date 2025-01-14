'use client';
import toast from 'react-hot-toast/headless';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useModalStore } from '@/components/modal/dialog-placeholder';
import { useAlertStore } from '@/components/modal/alert-placeholder';
import Alert from '@/components/modal/alert';

import Spinner from '../spinner';
import BaseButton from '@/components/buttons/base-button';
import ChapterItem from './chapter-item';

import { BubbleChatAddIcon, CheckmarkCircle01Icon } from '@hugeicons/react';
import CreateChapterDialog from './create-chapter-dialog';
import { parseError } from '@/utils/utils';

import {
  getChapters,
  createChapter,
  deleteChapter,
  updateChapter,
  copyChapter,
} from '@/service/chapter';

const CreateChapter = function ({ listChapters, storyId }) {
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

  return (
    <div className="w-full px-6 border-b">
      <div
        className="flex flex-row py-4 items-center"
        onClick={() =>
          openModal(
            <CreateChapterDialog
              title={'Create chapter'}
              onConfirm={async (data) => {
                const tid = toast.loading('Creating chapter...', {
                  icon: <Spinner />,
                });
                try {
                  await createChapter({
                    ...data,
                    storyId,
                  });
                  toast.success('Chapter created', {
                    id: tid,
                    icon: <CheckmarkCircle01Icon />,
                  });
                } catch (e) {
                  toast.dismiss(tid);
                  AlertError("Can't create the chapter: " + parseError(e));
                } finally {
                  await listChapters();
                }
              }}
            />
          )
        }
      >
        <BubbleChatAddIcon className="text-rs-text-secondary" strokeWidth={1} />
        <div className="mx-2 pl-1 flex-1 text-rs-text-secondary cursor-text">
          Start a chapter
        </div>
        <BaseButton label="Create" />
      </div>
    </div>
  );
};

export default function Chapters({ storyId }) {
  const router = useRouter();

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const listChapters = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChapters(storyId);
      setChapters(data.chapters || []);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

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
    listChapters();
  }, [storyId]);

  const onEditChapter = (chapter) => {
    router.push(`/ch/${chapter.id}`);
  };

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="text-rs-text-secondary text-[16px]">
          No chapter here.
        </div>
        <BaseButton
          label="Create"
          className="mt-2"
          onClick={() => {
            openModal(
              <CreateChapterDialog
                onConfirm={async (data) => {
                  const tid = toast.loading('Creating chapter...', {
                    icon: <Spinner />,
                  });
                  await createChapter({
                    ...data,
                    storyId,
                  });
                  await listChapters();
                  toast.success('Chapter created', {
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
      <CreateChapter
        listChapters={listChapters}
        storyId={storyId}
      />
      {chapters.map((chapter) => (
        <ChapterItem
          key={chapter.id}
          chapter={chapter}
          onEditClick={onEditChapter}
          onUpdateClick={() => {
            openModal(
              <CreateChapterDialog
                data={chapter}
                onConfirm={async (data) => {
                  const tid = toast.loading('Updating chapter...', {
                    icon: <Spinner />,
                  });
                  try {
                    await updateChapter({
                      ...chapter,
                      ...data
                    });
                    toast.success('Chapter updated', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't update the chapter: " + parseError(e));
                  } finally {
                    await listChapters();
                    toast.dismiss(tid);
                  }
                }}
              />
            );
          }}
          onDuplicateClick={() => {
            openModal(
              <CreateChapterDialog
                title="Duplicate chapter"
                data={{ name: chapter.name + ' copy', description: chapter.description }}
                onConfirm={async (data) => {
                  const tid = toast.loading('Duplicating chapter...', {
                    icon: <Spinner />,
                  });
                  try {
                    const res = await copyChapter({
                      ...chapter,
                      ...data,
                    });
                    router.push(`/ch/${res.id}`);
                    toast.success('Chapter duplicated', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                  } catch (e) {
                    AlertError("Can't dulicate the chapter: " + parseError(e));
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
                title="Delete chapter?"
                message="If you delete this chapter, 
                you won't be able to restore it."
                onConfirm={async () => {
                  const tid = toast.loading('Deleting chapter...', {
                    icon: <Spinner />,
                  });
                  try {
                    await deleteChapter(chapter.id);
                    toast.success('Chapter deleted', {
                      id: tid,
                      icon: <CheckmarkCircle01Icon />,
                    });
                    await listChapters();
                  } catch (e) {
                    AlertError("Can't delete the chapter: " + parseError(e));
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
