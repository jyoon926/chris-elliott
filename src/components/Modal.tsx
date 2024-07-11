import React from 'react';
import { MdClose } from 'react-icons/md';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-background rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 p-4 flex flex-col items-end justify-start">
        <button onClick={onClose} className="text-right text-xl font-bold"><MdClose /></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
