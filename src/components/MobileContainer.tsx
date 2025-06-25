import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default MobileContainer; 