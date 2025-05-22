import { AppealAlertDialog } from '@/components/columns/activity/appeal-alert-dialog';
import InitialComponents from '@/components/common/initial-components';
import NavBar from '@/components/navbar/navbar';
import './global.css';
import MHeader from '@/components/navbar/m-header';
import { DEFAULT_TDK } from '@/utils/const';

export const metadata = {
  applicationName: 'Rollingsagas',
  icons: {
    icon: '/favicon.ico',
  },
  ...DEFAULT_TDK,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <div className="flex h-full relative z-10 sm:flex-row flex-col-reverse">
          <NavBar />
          <div className="flex overflow-y-hidden overflow-x-auto w-full h-full flex-auto">
            <div className="flex flex-row flex-grow justify-center">
              {children}
            </div>
            <div className="min-w-[76px] sm:block hidden" />
          </div>
          <MHeader />
        </div>
        <InitialComponents />
        <AppealAlertDialog />
      </body>
    </html>
  );
}
