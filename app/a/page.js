'use client';
export const runtime = 'edge';

import Column from '@/components/column/column';
import ActivityColumnWrap from '@/components/columns/activity/activity-column-wrap';
import ColumnHeaderDropdown from '@/components/column/column-header-dropdown';
import { useState } from 'react';

const ActivityDropdownItems = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Social',
    value: 'social',
  },
  // {
  //   label: 'Subscription',
  //   value: 'subscription',
  // },
  {
    label: 'Notification',
    value: 'notification',
  },
];

export default function Page() {
  const [tab, setTab] = useState(ActivityDropdownItems[0].value);

  return (
    <Column
      // headerLeft={<Back />}
      headerLeft={null}
      headerCenter={
        <ColumnHeaderDropdown value={tab} options={ActivityDropdownItems} onChange={setTab} />
      }
    >
      <ActivityColumnWrap type={tab} />
    </Column>
  );
}
