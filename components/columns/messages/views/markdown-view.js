'use-client'

import { parseMarkdown } from "@/utils/utils";

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
