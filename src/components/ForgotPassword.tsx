import React, { useState } from 'react';
import MobileContainer from './MobileContainer';
import AppLogo from './AppLogo';
import api from "../services/customer_api";
import { FloatingWhatsApp } from '@carlos8a/react-whatsapp-floating-button';
import AppWhatsApplogo from '../assets/logo.jpg';

interface ForgotPasswordProps {
    onBackToLogin: () => void;
    onLoginPage?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onLoginPage }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.post('/customer/forgot-password', { email }).then((response) => {
                setMessage('You will receive password reset instructions.');    
                setEmail('');
            }).catch((error) => {
                setError(error.response.data.message);    
            })
        } catch (err) {
            setError('An error occurred while requesting password reset. Please try again.');
        }
    };

    return (
        <MobileContainer>
            <FloatingWhatsApp
                phoneNumber='60109630963' // Required
                accountName='Apsco Malaysia' // Optional
                avatar={AppWhatsApplogo} // Optional
                initialMessageByServer='Hi there! How can I assist you?' // Optional
                initialMessageByClient='Hello! I found your contact on your website. I would like to chat with you about...' // Optional
                statusMessage='Available' // Optional
                startChatText='Start chat with us' // Optional
                tooltipText='' // Optional
                allowEsc={true} // Optional
                // Explore all available props below
            />
            <div className="min-h-screen bg-white px-4 py-8">
                {/* Logo and Title */}
                <div className="text-center mb-12">
                    <AppLogo isChangeHeight={true} />
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Reset your password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your email"
                        />
                    </div>

                    {message && (
                        <div className="rounded-md bg-green-50 p-4">
                            <div className="text-sm text-green-700">{message}</div>
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Send reset instructions
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                                onClick={() => {
                                    if (onLoginPage) {
                                        onLoginPage();
                                    } else {
                                        onBackToLogin();
                                    }
                                }}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            Back to login
                        </button>
                    </div>
                </form>
            </div>
        </MobileContainer>
    );
};

export default ForgotPassword; 