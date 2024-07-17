"use client"
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(null);

  const handleOpenModal = (modalId) => {
    setOpenModal(modalId);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, handleOpenModal, handleCloseModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
