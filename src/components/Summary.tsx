import React from 'react';
import MobileContainer from './MobileContainer';
import Header from './Header';
import { setStep } from "../auth/bookingSlice";
import { useAppDispatch } from "../hooks";

interface SummaryProps {
    onBack: () => void;
    onConfirm: () => void;
    onLogout: () => void;
    onViewBookingHistory: () => void;
    bookingDetails: {
        serviceCenter: {
            name: string;
            address: string;
        };
        vehicle: {
            model: string;
            year: string;
            plateNumber: string;
        };
        services: {
            packageType: string;
            selectedServices: string[];
            remarks: string;
        };
        appointment: {
            date: string | null;
            time: string | null;
        };
    };
}

const Summary: React.FC<SummaryProps> = ({
    onBack,
    onConfirm,
    onLogout,
    onViewBookingHistory,
    bookingDetails
}) => {
    const dispatch = useAppDispatch();
    const currentSteps = (currentStepString: string) => {
        dispatch(setStep(currentStepString));
    };
    return (
        <MobileContainer>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="px-4 py-3">
                    <Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} />
                </div>

                {/* Progress Steps */}
                <div className="px-4 py-4 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex items-center">
                            <div className="cursor-pointer w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm" onClick={() => currentSteps('location')}>1</div>
                            <div className="flex-1 h-0.5 bg-green-500"></div>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="cursor-pointer w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm" onClick={() => currentSteps('appointment')}>2</div>
                            <div className="flex-1 h-0.5 bg-green-500"></div>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="cursor-pointer w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm" onClick={() => currentSteps('car-details')}>3</div>
                            <div className="flex-1 h-0.5 bg-green-500"></div>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="cursor-pointer w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm" onClick={() => currentSteps('service-type')}>4</div>
                            <div className="flex-1 h-0.5 bg-green-500"></div>
                        </div>
                        <div className="cursor-pointer w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm" onClick={() => currentSteps('summary')}>5</div>
                    </div>

                    <div className="mt-2 flex justify-between text-xs">
                        <span className="text-green-500">Location</span>
                        <span className="text-green-500">Appointment</span>
                        <span className="text-green-500">Car Details</span>
                        <span className="text-green-500">Service Type</span>
                        <span className="text-blue-500">Summary</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4">
                        <div className="flex items-center mb-6">
                            <button
                                onClick={onBack}
                                className="flex items-center text-blue-500"
                            >
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                            <h2 className="text-lg font-semibold ml-3">Booking Summary</h2>
                        </div>

                        {/* Service Center Details */}
                        <div className="mb-6">
                            <div className="flex items-start">
                                <div className="mt-1">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-[18px] text-gray-800">Service Center</h3>
                                    <p className="text-[16px] text-gray-600">{bookingDetails.serviceCenter.name}</p>
                                    <p className="text-[16px] text-gray-600">{bookingDetails.serviceCenter.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Details */}
                        <div className="mb-6">
                            <div className="flex items-start">
                                <div className="mt-1">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM8 12h8" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-[18px] text-gray-800">Vehicle Details</h3>
                                    <p className="text-[16px] text-gray-600">{`${bookingDetails.vehicle.model} (${bookingDetails.vehicle.year})`}</p>
                                    <p className="text-[16px] text-gray-600">Plate Number: {bookingDetails.vehicle.plateNumber}</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Details */}
                        <div className="mb-6">
                            <div className="flex items-start">
                                <div className="mt-1">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="ftext-[18px] text-gray-800">Service Details</h3>
                                    <div className="text-[16px] text-gray-600">
                                        <div> Package: {bookingDetails.services.packageType}</div>
                                    </div>
                                    <div className="text-[16px] text-gray-600">
                                        {bookingDetails.services.selectedServices.map((service, index) => (
                                            <div key={index}>{service}</div>
                                        ))}
                                    </div>
                                    {bookingDetails.services.remarks && (
                                        <p className="text-[16px] text-gray-600 mt-2">
                                            Remarks: {bookingDetails.services.remarks}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Appointment Time */}
                        <div className="mb-6">
                            <div className="flex items-start">
                                <div className="mt-1">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-[18px] text-gray-800">Appointment Time</h3>
                                    <p className="text-[16px] text-gray-600">
                                        {bookingDetails.appointment.date && bookingDetails.appointment.time ? (
                                            `${bookingDetails.appointment.date} at ${bookingDetails.appointment.time}`
                                        ) : (
                                            'Appointment time not set'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={onConfirm}
                            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
};

export default Summary; 