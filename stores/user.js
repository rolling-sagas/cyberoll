import { create } from 'zustand';
import { getUserInfo } from '@/service/user';
import { dailyCheck } from '@/service/credits';

const useUserStore = create((set) => ({
  userInfo: null,
  subscription: {
    type: 'free',
  },
  getUserInfo: async () => {
    const info = await getUserInfo();
    set({
      userInfo: info,
    });
  },
  dailyCheck: async () => {
    const subscription = await dailyCheck();
    set({
      subscription,
    });
  },
}));

export default useUserStore;
