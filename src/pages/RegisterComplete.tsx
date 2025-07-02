import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '../components/AppLogo';
import { resetBooking, setStep } from "../auth/bookingSlice";
import { useAppDispatch } from "../hooks";

interface RegisterCompleteProps {
    handleBackToLogin: () => void;
    onViewBookingHistory: () => void;
}

const RegisterComplete: React.FC<RegisterCompleteProps>  = ({handleBackToLogin, onViewBookingHistory}) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const onSigninClick = () => {
        dispatch(setStep('location'));
        dispatch(resetBooking())
        //navigate('/')
        onViewBookingHistory()
        navigate('/')
        //handleBackToLogin()
    }
    useEffect(() => {
        // setTimeout(() => {
        //     dispatch(setStep('login'))
        //     navigate('/')
        // }, 4000)
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="min-h-screen bg-white flex justify-center">
                <div className="w-full max-w-[420px] bg-white min-h-screen">
                    <div className="min-h-screen bg-white px-4 py-8">
                        <div className="text-center">
                            <AppLogo isChangeHeight={true} />
                            {/* <h2 className="mt-4 text-2xl font-bold text-gray-900">Please verify your email</h2> */}
                        </div>
                        <div className="flex flex-col justify-center items-center mt-10 space-y-6 text-center">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                                </svg>
                            </div>
                            <p className="mt-2 text-center text-gray-600">A verification email has been sent to your account. Please verify your email.</p>
                            <div>
                                <button
                                    type="submit"
                                    onClick={onSigninClick}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
};

export default RegisterComplete;
