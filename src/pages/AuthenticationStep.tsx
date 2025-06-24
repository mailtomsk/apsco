import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface AuthenticationStepProps {
  onNext: () => void;
  onBack: () => void;
}

const AuthenticationStep: React.FC<AuthenticationStepProps> = ({ onNext, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [authMethod, setAuthMethod] = useState<'sms' | 'whatsapp'>('sms');

  const handleGetOTP = () => {
    if (phoneNumber) {
      setShowOTP(true);
    }
  };

  const handleVerifyOTP = () => {
    // In a real app, verify OTP with backend
    // For demo, we'll accept any 6-digit code
    if (otp.length === 6) {
      onNext();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-xl font-bold ml-4">Sign Up/Login</h2>
      </div>

      <div className="bg-white rounded-lg">
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg font-medium transition-colors
              ${authMethod === 'sms'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setAuthMethod('sms')}
          >
            Via SMS
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-medium transition-colors
              ${authMethod === 'whatsapp'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setAuthMethod('whatsapp')}
          >
            Via WhatsApp
          </button>
        </div>

        <div className="mb-6">
          <div className="flex border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-r">
              +60
            </div>
            <input
              type="tel"
              className="flex-1 p-2 outline-none"
              placeholder="Mobile"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>

        {!showOTP ? (
          <button
            className={`w-full py-3 rounded-lg text-white font-medium mb-6
              ${phoneNumber.length >= 9
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-300 cursor-not-allowed'}`}
            onClick={handleGetOTP}
            disabled={phoneNumber.length < 9}
          >
            Get OTP
          </button>
        ) : (
          <div className="mb-6">
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
            />
            <button
              className={`w-full py-3 rounded-lg text-white font-medium
                ${otp.length === 6
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6}
            >
              Verify OTP
            </button>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mb-6">
          By doing this, I agree to TISCO's{' '}
          <a href="#" className="text-blue-500">Terms</a> and{' '}
          <a href="#" className="text-blue-500">Privacy Policy</a>
        </div>

        <div className="relative text-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button className="w-full py-2 px-4 border rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default AuthenticationStep;