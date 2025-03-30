import {create} from 'zustand';

export const useToggleStore = create((set) => ({
  activeTab: 'year', // Default to "Yearly"
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
