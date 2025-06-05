'use client';
export const runtime = 'edge';

import PinnedColumns, {
  useColumnsStore,
} from '@/components/columns/pinned-columns';
import { useEffect, useState } from 'react';

import Column from '@/components/column/column';
import Editor from '@/components/columns/editor/editor';
import MessagesView from '@/components/columns/messages/messages-view';
import Spinner from '@/components/columns/spinner';
import CreateStoryForm from '@/components/columns/stories/create-story-form';
import StoryGuideOverlay from '@/components/columns/stories/story-guide-overlay';
import Back from '@/components/common/back';
import { updateStory } from '@/service/story';
import { initStory } from '@/stores/actions/story';
import useStore from '@/stores/editor';
import { CheckmarkCircle01Icon, HelpCircleIcon } from '@hugeicons/react';
import toast from 'react-hot-toast/headless';

export default function Page({ params }) {
  const id = params.id;
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);
  const story = useStore((state) => state.story);
  const [saving, setSaving] = useState(false);

  const update = async (name, description, image, keepPrivate) => {
    if (saving) return;
    setSaving(true);
    const tid = toast.loading('Saving story...', {
      icon: <Spinner />,
    });
    try {
      await updateStory(id, {
        name,
        description,
        image,
        keepPrivate,
      });
      useStore.setState({
        story: {
          ...story,
          name,
          description,
          image,
          keepPrivate,
        },
      });
      toast.success('Story saved', {
        id: tid,
        icon: <CheckmarkCircle01Icon />,
      });
    } catch (e) {
      console.error(e);
      toast.dismiss(tid);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    reset();
    const storyId = useStore.getState().storyId;
    if (storyId === id || !id) return;
    try {
      useStore.getState().reset({
        storyId: id,
      });
      initStory(id);
    } catch (e) {
      console.error(e);
    }
  }, [addColumn, id]);

  return (
    <PinnedColumns>
      <StoryGuideOverlay />
      <Column headerLeft={<Back />} headerCenter="Story">
        <div className="px-6 py-4 w-full">
          {story ? (
            <CreateStoryForm
              name={story.name}
              desc={story.description}
              image={story.image}
              keepPrivate={story.keepPrivate}
              showPublicSwitch
              onConfirm={update}
              saving={saving}
            />
          ) : null}
        </div>
      </Column>
      <Column headerCenter="Messages">
        <MessagesView />
      </Column>
      <Column
        headerCenter={
          <div className="flex items-center gap-1">
            <span>Editor</span>
            <a
              href="https://helps.rollingsagas.com/#/build_story"
              target="_blank"
            >
              <HelpCircleIcon size={18} variant="solid" />
            </a>
          </div>
        }
      >
        <Editor />
      </Column>
    </PinnedColumns>
  );
}
