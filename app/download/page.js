export const runtime = 'edge';

export async function generateMetadata() {
  return {
    title: 'Download - Rolling Sagas',
  };
}

import Logo from '@/components/navbar/logo';
import { Pacifico } from 'next/font/google';
import Head from 'next/head';
import Link from 'next/link';

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' });

const DOC_LINKS = [
  {
    key: 'about',
    title: 'About us',
    url: 'https://helps.rollingsagas.com/#/about_us',
  },
  {
    key: 'terms-of-services',
    title: 'Terms of service',
    url: 'https://helps.rollingsagas.com/#/policies/terms-of-service',
  },
  {
    key: 'privacy-policy',
    title: 'Privacy policy',
    url: 'https://helps.rollingsagas.com/#/policies/privacy-policy',
  },
  {
    key: 'features',
    title: 'Features',
    url: 'https://helps.rollingsagas.com/#/getting_started',
  },
];

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <Head>
        <title>Download - Rolling Sagas</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* 主体内容 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Logo size={64} className="" />
            <span
              className={`${pacifico.className} font-bold text-3xl md:text-4xl tracking-tight`}
            >
              Rolling Sagas
            </span>
          </div>
          <div className="text-sm md:text-base text-muted-foreground font-normal tracking-normal text-center">
            Your story. Your rules. Your Game Master.
          </div>
        </div>
        {/* 下载按钮 */}
        <a
          href="https://apps.apple.com/us/app/rolling-sagas/id6744714857"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-foreground text-background rounded-xl px-8 py-3 font-semibold text-lg md:text-xl shadow hover:opacity-90 transition mb-8 min-w-[220px] max-w-full"
          style={{ fontFamily: 'inherit' }}
        >
          <span className="mr-2 flex items-center -mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="4 32 376.4 449.4"
              width="28"
              height="28"
              fill="white"
            >
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5a106 106 0 0 0-67.9 34.9 95.7 95.7 0 0 0-25.6 71.9c26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
          </span>
          Download iOS
        </a>
      </main>
      {/* 底部文档链接和版权 */}
      <footer className="w-full px-2 md:px-0 pb-4 flex flex-col items-center">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm mb-2">
          {DOC_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.url}
              className="hover:underline text-muted-foreground"
              target="_blank"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="text-xs text-muted-foreground text-center max-w-xl mb-[90px] sm:mb-[5px]">
          <div>©{new Date().getFullYear()} ROLLINGSAGAS PTE. LTD.</div>
          <div>
            Rolling Sagas, the Rolling Sagas logo, and all related trademarks,
            including but not limited to &apos;Powering Your Imagination,&apos;
            are registered and unregistered trademarks of ROLLINGSAGAS PTE. LTD.
            in Singapore and other countries.
          </div>
        </div>
      </footer>
    </div>
  );
}
