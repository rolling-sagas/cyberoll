import { getActivities } from '@/service/activity';
import useUserStore from '@/stores/user';
import { useEffect, useState } from 'react';

export default function ActivityColumnWrap({ type }) {
  const userInfo = useUserStore((state) => state.userInfo);
  const [activities, setActivities] = useState(undefined);

  useEffect(() => {
    if (userInfo) {
      const fetchData = async () => {
        const res = await getActivities();
        setActivities(res);
      };
      fetchData();
    }
  }, [userInfo]);

  return (
    <div>
      {type}
      <hr />
      {JSON.stringify(activities || {})}
    </div>
  );
}
