import React, { useState, useEffect, useRef } from 'react';
import { Info, X } from 'lucide-react';
import SampleProfileImage from '../assets/sample-profile-imag.jpg';

const SampleProfilePopup = () => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
        }}
      >
        <Info className="w-3.5 h-3.5 ml-1 text-black cursor-pointer" />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-800 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={SampleProfileImage}
              alt="Sample Profile"
              className="w-full h-auto rounded px-8 py-6"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleProfilePopup;