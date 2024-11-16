// stores/modal-store.ts
import { create } from 'zustand';

interface ModalState {
  modalId: string | null;
  data: any;
  actions: {
    openModal: (modalId: string, data?: any) => void;
    closeModal: () => void;
    getModalData: () => any;
  };
}

export const useModalStore = create<ModalState>((set, get) => ({
  modalId: null,
  data: null,
  actions: {
    openModal: (modalId: string, data: any = null) => {
      set({ 
        modalId,
        data
      });
    },
    closeModal: () => {
      set({ 
        modalId: null,
        data: null
      });
    },
    getModalData: () => get().data
  }
}));