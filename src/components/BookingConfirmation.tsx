import React from 'react';
import MobileContainer from './MobileContainer';

interface BookingConfirmationProps {
    bookingReference: string;
    appointmentDate: string;
    appointmentTime: string;
    onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
    bookingReference,
    appointmentDate,
    appointmentTime,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto text-center">
                {/* Car Icon */}
                <div className="mb-6">
                    {/* <svg
                        className="mx-auto h-12 w-12 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM8 12h8M9 4v2m6-2v2m0 8v2m-6-2v2"
                        />
                    </svg> */}
                </div>

                {/* Success Icon */}
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Confirmation Message */}
                <h2 className="text-xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">Your service appointment has been successfully scheduled.</p>

                {/* Booking Details */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Booking Reference:</span>
                        <span className="font-medium">{bookingReference}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Appointment:</span>
                        <span className="font-medium">{appointmentDate} / {appointmentTime}</span>
                    </div>
                </div>

                {/* Done Button */}
                <button
                    onClick={onClose}
                    className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmation; 