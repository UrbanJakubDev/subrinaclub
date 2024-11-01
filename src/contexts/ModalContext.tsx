"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

const ModalContext = createContext({});

export const useModal = () => useContext(ModalContext);


const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState(null);
  const [modalData, setModalData] = useState({ data: null });
  const [modalSubmitted, setModalSubmitted] = useState(false);


  // TODO: Change data to data object
  const handleOpenModal = (modalId: string, data: any = null) => {
    setModalData({ data });
    setOpenModal(modalId);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const handleModalSubmitted = () => {
    setModalSubmitted(true);
    handleCloseModal();
  };



  return (
    <ModalContext.Provider value={{ openModal, handleOpenModal, handleCloseModal, modalData, modalSubmitted, handleModalSubmitted, setModalSubmitted }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
