import termsOfServicesMDContent from '@/components/doc/md/terms-of-services';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

const defaultContent = 'Content not found';

function getContentByKey(key) {
  console.log({ key });
  switch (key) {
    case 'terms-of-services':
      return termsOfServicesMDContent;
    default:
      return defaultContent;
  }
}

export default function DocPage({ params }) {
  const { key } = params;
  return (
    <div className="container mx-auto mt-[60px] h-[calc(100vh-60px)] overflow-y-auto overscroll-contain scrollbar-none flex flex-col items-center">
      <div className="py-8 px-8 max-w-xl">
        <MarkdownRenderer content={getContentByKey(key)} />
      </div>
    </div>
  );
}
