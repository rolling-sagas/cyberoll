'use client';
export const runtime = 'edge';

import cookiesPolicyMDContent from '@/components/doc/md/cookies-policy';
import privacyPolicyMDContent from '@/components/doc/md/privacy-policy';
import rulesOfConductMDContent from '@/components/doc/md/rules-of-conduct';
import termsOfServicesMDContent from '@/components/doc/md/terms-of-services';
import { MarkdownRenderer } from '@/components/markdown/markdown-renderer';
const defaultContent = 'Content not found';

function getContentByKey(key) {
  const doc = docs.find((doc) => doc.key === key);
  return doc?.content || defaultContent;
}

export const docs = [
  {
    key: 'terms-of-services',
    title: 'Terms of Services',
    content: termsOfServicesMDContent,
  },
  {
    key: 'privacy-policy',
    title: 'Privacy Policy',
    content: privacyPolicyMDContent,
  },
  {
    key: 'rules-of-conduct',
    title: 'Rules of Conduct',
    content: rulesOfConductMDContent,
  },
  {
    key: 'cookies-policy',
    title: 'Cookies Policy',
    content: cookiesPolicyMDContent,
  },
];

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
