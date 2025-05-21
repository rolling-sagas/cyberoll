import { create } from 'zustand';

const useAppealDialogStore = create((set) => ({
  isOpen: false,
  content: '',
  style: {},
  setIsOpen: (isOpen) => set({ isOpen }),
  setContent: (content) => set({ content }),
  setStyle: (styles) => set({ style: styles }),
}));

export const showAppealDialog = (content, styles = {}) => {
  const store = useAppealDialogStore.getState();
  store.setContent(content);
  store.setIsOpen(true);
  store.setStyle(styles);
};

export { useAppealDialogStore };
