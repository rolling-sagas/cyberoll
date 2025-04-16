'use client';
export const runtime = 'edge';

import PinnedColumns from '@/components/columns/pinned-columns';
import { useColumnsStore } from '@/components/columns/pinned-columns';
import { useState, useEffect } from 'react';

import MessagesView from '@/components/columns/messages/messages-view';
import Editor from '@/components/columns/editor/editor';
import Column from '@/components/column/column';
import useStore from '@/stores/editor';
import { initStory } from '@/stores/actions/story';
import Back from '@/components/common/back';
import CreateStoryForm from '@/components/columns/stories/create-story-form';
import { updateStory } from '@/service/story';
import toast from 'react-hot-toast/headless';
import { CheckmarkCircle01Icon } from '@hugeicons/react';
import Spinner from '@/components/columns/spinner';
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
    } finally {
      setSaving(false);
      toast.success('Story saved', {
        id: tid,
        icon: <CheckmarkCircle01Icon />,
      });
    }
  };

  useEffect(() => {
    reset();
    const loading = useStore.getState().loading;
    if (loading) return;
    try {
      useStore.setState(() => ({
        loading: true,
      }));
      useStore.getState().reset();
      useStore.setState(() => ({
        storyId: id,
      }));
      initStory(id);
    } finally {
      useStore.setState(() => ({
        loading: false,
      }));
    }
  }, [addColumn, id]);

  return (
    <PinnedColumns>
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
      <Column headerCenter="Editor">
        <Editor />
      </Column>
    </PinnedColumns>
  );
}
