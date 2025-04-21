import termsOfServicesMDContent from '@/components/doc/md/terms-of-services';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';

export default function DocPage() {
  return (
    <div className="container mx-auto mt-[60px] h-[calc(100vh-60px)] overflow-y-auto overscroll-contain scrollbar-none bg-rs-background-2">
      <div className="py-8 px-8 max-w-xl">
        <MarkdownRenderer content={termsOfServicesMDContent} />
      </div>
    </div>
  );
}
