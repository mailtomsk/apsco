import React, { useState } from 'react';
import { User, LogOut, History } from 'lucide-react';
import AppLogo from './AppLogo';


interface HeaderProps {
  onLogout: () => void;
  onViewBookingHistory: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onViewBookingHistory }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-white">
      <div className="px-4 py-6">
        <div className="flex justify-center items-center">
          {/* <h1 className="text-2xl font-bold text-blue-600">TISCO</h1> */}
          <AppLogo isChangeHeight={true} isCenterAlign={false} />
          <div className="relative">
            {/* <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none"
            >
              <User className="w-6 h-6 text-gray-600" />
            </button> */}

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => {
                    onViewBookingHistory();
                    setShowMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <History className="w-4 h-4 mr-2" />
                  Booking History
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setShowMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center mt-3">
          <h2 className='text-[20px] font-medium'>Book a Service Appointment</h2>
        </div>
      </div>
    </header>
  );
};

export default Header; 