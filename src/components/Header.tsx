import React, { useState } from 'react';
import { LogOut, History, Menu, Plus } from 'lucide-react';
import AppLogo from './AppLogo';
import { useAppSelector } from '../hooks';
import { FloatingWhatsApp } from '@carlos8a/react-whatsapp-floating-button';
import AppWhatsApplogo from '../assets/logo.jpg';


interface HeaderProps {
  onBack?: () => void;
  onLogout: () => void;
  onViewBookingHistory: () => void;
  onLogin: () => void;
  hideBack?: boolean;
  currentStep?: string;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onViewBookingHistory, onBack, onLogin, currentStep, hideBack = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.auth.customerAuth.isLoggedIn);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
    <FloatingWhatsApp
        phoneNumber='60109630963' // Required
        accountName='Apsco Malaysia' // Optional
        avatar={AppWhatsApplogo} // Optional
        initialMessageByServer='Hi there! How can I assist you?' // Optional
        initialMessageByClient='Hello! I found your contact on your website. I would like to chat with you about...' // Optional
        statusMessage='Available' // Optional
        startChatText='Start chat with us' // Optional
        tooltipText='Need help? Click to chat!' // Optional
        allowEsc={true} // Optional
        // Explore all available props below
      />
    <header className="bg-white">
      <div className="py-6">
        <div className="justify-center items-center grid grid-cols-12">
          {/* <h1 className="text-2xl font-bold text-blue-600">TISCO</h1> */}
          {!hideBack && (
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 col-span-2 justify-self-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          {hideBack && (
            <div className="col-span-2"></div>
          )}
          
          <AppLogo isChangeHeight={true} isCenterAlign={false}/>
          <div className="relative col-span-2 justify-self-center mx-auto">
              {(currentStep === "location" || isAuthenticated) && (
              <button
                onClick={toggleMenu}
                className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none">
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              )}
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                {isAuthenticated ? (
                  <>
                  
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
                </>
                ) : (
                  <>
                  {currentStep === "location" && (
                  <button 
                    onClick={() => {
                      onLogin();
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut className="w-4 h-4 mr-2 rotate-180" />
                    Login
                  </button>
                  )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center mt-3">
          <h2 className='text-[20px] font-medium'>Book a Service Appointment</h2>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header; 