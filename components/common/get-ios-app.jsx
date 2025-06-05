'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const appMagicUrl = 'https://apps.apple.com/us/app/rolling-sagas/id6744714857';

function FloatingImage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldHideComponent, setShouldHideComponent] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check if current path should hide the component
    const path = window.location.pathname;
    setShouldHideComponent(
      (path?.startsWith('/st/') && path?.includes('/edit')) ||
        path?.startsWith('/sess/') ||
        path?.includes('/download')
    );

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Auto-hide after 120 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 120000);

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  if (isMobile || !isVisible || shouldHideComponent) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1">
      <span className="text-[15px] text-muted-foreground font-medium text-center">
        Scan to get the app
      </span>
      <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200">
        <Image
          src="/ios_app.png"
          alt="iOS App"
          width={174}
          height={174}
          className="hover:scale-105 transition-transform duration-200"
          priority
        />
      </div>
    </div>
  );
}

function GoIosAppBtn() {
  const [isAppleDevice, setIsAppleDevice] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // 检测是否为苹果设备
    const isApple = /iPad|iPhone|iPod|Macintosh|Mac/.test(navigator.userAgent);
    setIsAppleDevice(isApple);

    // 检测是否为 Safari 浏览器
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(
      navigator.userAgent
    );
    setIsSafari(isSafariBrowser);
  }, []);

  const handleClick = () => {
    window.open(appMagicUrl, '_blank');

    console.log('isSafari', isSafari);
    // if (isSafari) {
    //   // 在 Safari 中广播当前链接
    //   // if (navigator.share) {
    //   //   navigator
    //   //     .share({
    //   //       title: document.title,
    //   //       url: window.location.href,
    //   //     })
    //   //     .catch(console.error);
    //   // }
    //   const now = Date.now();
    //   window.location.href = 'https://dev.cyberoll.pages.dev/';

    //   setTimeout(() => {
    //     if (Date.now() - now < 2000) {
    //       window.open(appMagicUrl, '_blank');
    //     }
    //   }, 1500);
    // } else {
    //   // 非 Safari 浏览器，打开 App Store
    //   window.open(appMagicUrl, '_blank');
    // }
  };

  if (!isAppleDevice) return null;

  return (
    <button
      onClick={handleClick}
      className="ml-[-74px] rounded-[12px] items-center text-rs-background-1 bg-foreground
      h-8 border-rs-border disabled:text-rs-text-secondary outline-none text-sm font-medium
      overflow-hidden text-ellipsis whitespace-nowrap px-8"
    >
      Get app
    </button>
  );
}

export { FloatingImage, GoIosAppBtn };
