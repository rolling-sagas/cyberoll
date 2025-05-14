import NavBar from '@/components/navbar/navbar';
import './global.css';
import InitialComponents from '@/components/common/initial-components';

export const metadata = {
  title: 'Roll your fate in AI-powered text adventures | Rollingsagas',
  applicationName: 'Rollingsagas',
  keywords: ['Rollingsagas', 'dice', 'AI-powered', 'creators'],
  description: 'Play and create AI-powered text adventures with classic dice rolls. Discover imaginative stories with a community of creators',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({ children }) {

  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     console.log(111, url);
  //   };

  //   Router.events.on('routeChangeStart', handleRouteChange);
  //   return () => {
  //     Router.events.off('routeChangeStart', handleRouteChange);
  //   };
  // }, []);

  // const pathname = usePathname()
  // useEffect(() => console.log(222, pathname), [pathname])

  // 如果是在 doc 路径下，直接返回 children
  // if (pathname?.startsWith('/doc')) {
  //   return (
  //     <html lang="en">
  //       <Head>
  //         <link rel="icon" href="/favicon.ico" sizes="any" />
  //         <title>Rolling Sagas Playground</title>
  //       </Head>
  //       <body suppressHydrationWarning={true}>
  //         {children}
  //       </body>
  //     </html>
  //   );
  // }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="flex h-svh relative z-10">
          <NavBar />
          <div className="flex overflow-y-hidden overflow-x-auto px-5 w-full">
            <div className="block min-w-[76px]" />
            <div className="flex flex-row flex-grow gap-3 justify-center">
              {children}
            </div>
            <div className="block min-w-[76px]" />
          </div>
        </div>
        <InitialComponents />
      </body>
    </html>
  );
}
