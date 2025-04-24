'use client';

import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';
import { useEffect } from 'react';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function FirebaseInit() {
  useEffect(() => {
    // 只在客户端初始化 Firebase
    const app = initializeApp(firebaseConfig);
    const perf = getPerformance(app);
    console.log({ app, perf });

    // 可以在这里添加其他 Firebase 初始化代码
  }, []);

  return null;
}
