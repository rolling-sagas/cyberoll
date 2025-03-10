import {create} from 'zustand';

export const useToggleStore = create((set) => ({
  activeTab: 'annually', // Default to "Yearly"
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
