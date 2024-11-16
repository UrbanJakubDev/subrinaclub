"use client";
import { Typography } from '@material-tailwind/react';
import React from 'react';
import { useModalStore } from '@/stores/ModalStore';

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  modalId: string;
  onClose?: () => void;
};

const ModalComponent = ({ children, title, description, modalId }: Props) => {
  const { modalId: currentModalId, actions } = useModalStore();
  const isModalOpen = currentModalId === modalId;

  if (!isModalOpen) return null;

  const handleClose = () => {
    actions.closeModal();
  };



  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div onClick={handleClose} className='bg-black text-white rounded-full w-8 h-8 text-center pt-1 font-bold hover:cursor-pointer hover:drop-shadow-xl'>
              X
            </div>
          </div>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <Typography variant='h4' >{title}</Typography>
                {description && <p>{description}</p>}
                <div className="mt-2">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ModalComponent;
