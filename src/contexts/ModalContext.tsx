"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);


const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState(null);
  const [modalData, setModalData] = useState({ transactionId: null });

  const handleOpenModal = (modalId: string, transactionId: number | null = null) => {
    setModalData({ transactionId });
    setOpenModal(modalId);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, handleOpenModal, handleCloseModal, modalData }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
