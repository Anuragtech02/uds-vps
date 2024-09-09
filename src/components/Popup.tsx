"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface PopupProps {
  paramName: string; // The name of the URL parameter that controls this popup
  children: React.ReactNode;
  title: string;
  onClose?: () => void;
}

const Popup: React.FC<PopupProps> = ({ paramName,title, children, onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const paramValue = searchParams.get(paramName);
    setIsOpen(paramValue === 'true');
  }, [searchParams, paramName]);

  const closePopup = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramName);
    router.push(`?${params.toString()}`);
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full m-4">
        <div className="flex justify-between items-center">
            <h3>{title}</h3>
          <button title='Close' onClick={closePopup} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Popup;