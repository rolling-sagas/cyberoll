"use client"
export const runtime = 'edge';

import PinnedColumns from "@/components/columns/pinned-columns";
import { useColumnsStore } from "@/components/columns/pinned-columns";
import { useEffect } from "react";

import MessagesView from "@/components/columns/messages/messages-view";
import Editor from "@/components/columns/editor/editor";
import Column from "@/components/column/column";
import useStore from "@/stores/editor";
import { initStory } from "@/stores/actions/story";

export default function Page({ params }) {
  const id = params.id
  const addColumn = useColumnsStore((state) => state.addColumn);
  const reset = useColumnsStore((state) => state.reset);

  useEffect(() => {
    reset()
    useStore.getState().reset()
    useStore.setState(() => ({
      storyId: id,
    }))
    initStory(id)
  }, [addColumn, id])

  return (
    <PinnedColumns>
      <Column headerCenter="Messages">
        <MessagesView />
      </Column>
      <Column headerCenter="Editor">
        <Editor />
      </Column>
    </PinnedColumns>
  );
}
