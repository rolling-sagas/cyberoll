'use client';

import { ArrowLeft02Icon } from '@hugeicons/react';
import { useRouter } from 'next/navigation';
import CircleIconButton from '../buttons/circle-icon-button';

export default function Back({ icon }) {
  const router = useRouter();
  return (
    <CircleIconButton
      onClick={router.back}
      icon={<ArrowLeft02Icon size={14} className="text-foreground" variant="solid" type="sharp" />}
    ></CircleIconButton>
  );
}
