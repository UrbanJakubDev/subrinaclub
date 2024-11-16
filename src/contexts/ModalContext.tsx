"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  openModal: string | null;
  modalData: any;
  handleOpenModal: (modalId: string, data?: any) => void;
  handleCloseModal: () => void;
  handleModalSubmitted: () => void;
  modalSubmitted: boolean;
  setModalSubmitted: (submitted: boolean) => void;
}

const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalSubmitted, setModalSubmitted] = useState(false);

  const handleOpenModal = (modalId: string, data: any = null) => {
    setModalData(data);
    setOpenModal(modalId);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setModalData(null);
  };

  const handleModalSubmitted = () => {
    setModalSubmitted(true);
    handleCloseModal();
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        modalData,
        handleOpenModal,
        handleCloseModal,
        modalSubmitted,
        handleModalSubmitted,
        setModalSubmitted,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
