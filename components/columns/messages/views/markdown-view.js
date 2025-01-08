'use-client'

import { parseMarkdown } from "@/components/utils";

export default function MarkdownView({ view }) {
  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{
        __html: parseMarkdown(view.value),
      }}
    />
  );
}
