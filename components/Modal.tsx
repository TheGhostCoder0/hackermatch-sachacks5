import React from "react";
import { BsX } from "react-icons/bs";

export interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex">
          <button
            className="font-bold hover:bg-gray-200 rounded-md"
            onClick={() => onClose()}
          >
            <BsX className="text-black" size={32} />
          </button>
          <div className="mr-2" />
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <div className="mb-4" />

        {children}
      </div>
    </div>
  );
};
