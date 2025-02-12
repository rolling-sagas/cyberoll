import {
  ArrowLeft01Icon,
} from '@hugeicons/react';
import { useRouter } from 'next/navigation';

export default function Back({text = 'Back', className = ''}) {
  const router = useRouter()
  return (
    <div
      className={`${className} flex cursor-pointer items-center text-sm text-gray-600`}
      onClick={router.back}
    >
      <ArrowLeft01Icon type='sharp' size={22} />
      {text}
    </div>
  );
}
