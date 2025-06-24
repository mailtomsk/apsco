import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-[420px] bg-white min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MobileContainer; 