import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, Clock, User } from 'lucide-react';

interface FloatingWhatsAppProps {
  phoneNumber: string;
  accountName?: string;
  avatar?: string;
  statusMessage?: string;
  chatMessage?: string;
  allowClickAway?: boolean;
  allowEsc?: boolean;
  className?: string;
  buttonClassName?: string;
  chatClassName?: string;
  darkMode?: boolean;
  notification?: boolean;
  notificationDelay?: number;
  notificationLoop?: number;
}

const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  accountName = "WhatsApp Support",
  avatar,
  statusMessage = "Typically replies instantly",
  chatMessage = "Hello! 👋🏼 How can we help you?",
  allowClickAway = true,
  allowEsc = true,
  className = "",
  buttonClassName = "",
  chatClassName = "",
  darkMode = false,
  notification = true,
  notificationDelay = 3000,
  notificationLoop = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Handle notification logic
  useEffect(() => {
    if (notification && !isOpen) {
      const timer = setTimeout(() => {
        setShowNotification(true);
        setNotificationCount(prev => prev + 1);
      }, notificationDelay);

      return () => clearTimeout(timer);
    }
  }, [notification, notificationDelay, isOpen, notificationCount]);

  // Handle notification loop
  useEffect(() => {
    if (showNotification && notificationLoop > 0 && notificationCount < notificationLoop) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showNotification, notificationLoop, notificationCount]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (allowEsc && event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, allowEsc]);

  // Handle click away
  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (allowClickAway && !target.closest('.whatsapp-widget')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickAway);
      return () => document.removeEventListener('mousedown', handleClickAway);
    }
  }, [isOpen, allowClickAway]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowNotification(false);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(chatMessage);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits and format for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, -10)} ${cleaned.slice(-10, -7)} ${cleaned.slice(-7, -4)} ${cleaned.slice(-4)}`;
    }
    return phone;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={`whatsapp-widget fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className={`mb-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 ease-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${chatClassName}`}>
          {/* Header */}
          <div className="bg-green-500 dark:bg-green-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={accountName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getInitials(accountName)}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{accountName}</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-green-100 text-xs">{statusMessage}</span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px] bg-opacity-50">
            <div className="space-y-3">
              {/* Welcome Message */}
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  {avatar ? (
                    <img 
                      src={avatar} 
                      alt={accountName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {getInitials(accountName)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm max-w-xs">
                  <p className="text-gray-800 dark:text-gray-200 text-sm">{chatMessage}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>{formatPhoneNumber(phoneNumber)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={openWhatsApp}
              className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Start Conversation</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="relative">
        {/* Notification Badge */}
        {showNotification && !isOpen && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
            1
          </div>
        )}

        {/* Notification Popup */}
        {showNotification && !isOpen && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 w-64 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={accountName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {getInitials(accountName)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{accountName}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{chatMessage}</p>
              </div>
            </div>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={toggleChat}
          className={`group relative bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${buttonClassName}`}
          aria-label="Open WhatsApp Chat"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200" />
          ) : (
            <MessageCircle className="w-6 h-6 transition-transform duration-200 group-hover:scale-110" />
          )}
          
          {/* Ripple Effect */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
        </button>
      </div>
    </div>
  );
};

export default FloatingWhatsApp;