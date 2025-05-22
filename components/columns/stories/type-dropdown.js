'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import ColumnHeaderDropdown from '@/components/column/column-header-dropdown';
const tabs = [
  {
    label: 'Discover',
    value: 'discover'
  },
  {
    label: 'Rencently Played',
    value: 'recently'
  }
]

export default function TypeDropdown() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'discover';
  const router = useRouter();

  const createQueryString = (tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    return params.toString();
  };

  const changeTab = (tab) => {
    if (tab === 'discover') return router.push('/');
    router.push('/?' + createQueryString(tab));
  };

  return (
    <ColumnHeaderDropdown options={tabs} value={tab} onChange={changeTab} />
  );
}
