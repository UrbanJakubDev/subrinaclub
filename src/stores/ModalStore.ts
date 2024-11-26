// stores/modal-store.ts
import { create } from 'zustand';

interface ModalState {
  modalId: string | null;
  data: any;
  actions: {
    openModal: (modalId: string, data?: any) => void;
    closeModal: () => void;
    resetModal: () => void;
    getModalData: () => any;
  };
}

export const useModalStore = create<ModalState>((set, get) => ({
  modalId: null,
  data: null,
  actions: {
    openModal: (modalId: string, data: any = null) => {
      console.log('Opening modal:', { modalId, data });
      set({ 
        modalId,
        data
      });
    },
    closeModal: () => {
      console.log('Closing modal');
      set({ 
        modalId: null,
        data: null
      });
    },
    resetModal: () => {
      set({
        modalId: null,
        data: null
      });
    },
    getModalData: () => get().data
  }
}));