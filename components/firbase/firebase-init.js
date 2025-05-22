'use client';

import { getAnalytics, logEvent } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { initializePerformance } from 'firebase/performance';

import { useEffect } from 'react';
import { utmTrack } from '../utm-tracker';

let app;
let perf;
let analytics;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function isFirebaseInitialized() {
  return app !== undefined;
}

export default function FirebaseInit() {
  useEffect(() => {
    // 只在客户端初始化 Firebase
    if (!app) {
      app = initializeApp(firebaseConfig);
      perf = initializePerformance(app, {
        logTraceAfterSampling: false,
        instrumentationEnabled: true,
        dataCollectionEnabled: true,

        // ✅ 关闭 DOM 属性记录
        autoCollect: false,
      });
      analytics = getAnalytics(app);
      if (perf) {
        console.log('Performance initialized');
      }
      if (analytics) {
        console.log('Analytics initialized');
      }
      utmTrack();
    }

    // 可以在这里添加其他 Firebase 初始化代码
  }, []);

  return null;
}

export { analytics, app, isFirebaseInitialized, logEvent, perf };
