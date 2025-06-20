import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LocationStep from './components/LocationStep';
import AppointmentBooking from './components/AppointmentBooking';
import CarDetails from './components/CarDetails';
import ServiceType from './components/ServiceType';
import Summary from './components/Summary';
import BookingConfirmation from './components/BookingConfirmation';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import BookingHistory from './components/BookingHistory';
import Admin from './admin';
import { State, Area } from './data/malaysiaLocations';
import { ServiceCenter } from './data/serviceCenters';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from "./hooks";
import { logoutCustomer, restoreCustomerSession } from "./auth/customerAuthSlice";
import { setStep, setLocation, setAppointment, setCarDetails, setServiceDetails, resetBooking } from "./auth/bookingSlice";
import api from "./services/customer_api";
import { toast } from "react-toastify";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from './pages/VerifyEmail';

type Step = 'login' | 'location' | 'appointment' | 'car-details' | 'service-type' | 'summary' | 'booking-history';

interface CarDetailsData {
    brand: string;
    model: string;
    year: string;
    plateNumber: string;
}

interface ServiceDetailsData {
    selectedServices: string[];
    remarks: string;
}

interface AppState {
    selectedState: State | null;
    selectedArea: Area | null;
    selectedCenter: ServiceCenter | null;
    carDetails: CarDetailsData | null;
    serviceDetails: ServiceDetailsData | null;
    appointmentDate: string | null;
    appointmentTime: string | null;
    error: string | null;
}

const App: React.FC = () => {
    const token = localStorage.getItem('customer_token');
    const userId = localStorage.getItem('customer_id');

    const [error, setError] = useState<string | null>(null);
    const [bookingReference, setBookingReference] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const [isSignUp, setIsSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showBookingHistory, setShowBookingHistory] = useState(false);
    
    const currentStep = useAppSelector((state) => state.auth.booking.step as Step);
    const isLoggedIn = useAppSelector((state) => state.auth.customerAuth);
    const { selectedState, selectedArea, selectedCenter } = useAppSelector((state) => state.auth.booking);
    const { appointmentDate, appointmentTime } = useAppSelector((state) => state.auth.booking);
    const { carDetails } = useAppSelector((state) => state.auth.booking);
    const { serviceDetails } = useAppSelector((state) => state.auth.booking);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (token && userId) {
            dispatch(restoreCustomerSession());
            if (currentStep === 'login') { 
                dispatch(setStep('location'));
            }
        } else {
            handleLogout();
        }
    }, [currentStep, selectedState, selectedArea, selectedCenter, appointmentDate, appointmentTime, carDetails, dispatch, token, userId]);

    const handleLoginSuccess = () => {
        dispatch(setStep('location'));
    };

    const handleLogout = () => {
        dispatch(setAppointment({ appointmentDate: null, appointmentTime: null }));
        dispatch(setLocation({ selectedState: null, selectedArea: null, selectedCenter: null }));
        dispatch(setCarDetails({ carDetails: null }));
        dispatch(setServiceDetails({ serviceDetails: null }));
        dispatch(logoutCustomer());
        dispatch(setStep('login'));
        setError(null);
    };

    const handleLocationSelect = (state: State, area: Area, center: ServiceCenter) => {
        try {
            dispatch(setLocation({ selectedState: state, selectedArea: area, selectedCenter: center }));
            dispatch(setStep('appointment'));
        } catch (err) {
            setError('Failed to select location');
        }
    };

    const handleAppointmentSelect = (date: string, timeSlot: string) => {
        try {
            dispatch(setAppointment({ appointmentDate: date, appointmentTime: timeSlot }));
            dispatch(setStep('car-details'));
        } catch (err) {
            setError('Failed to select appointment');
        }
    };

    const handleBack = () => {
        try {
            switch (currentStep) {
                case 'appointment':
                    dispatch(setStep('location'));
                    break;
                case 'car-details':
                    dispatch(setStep('appointment'));
                    break;
                case 'service-type':
                    dispatch(setStep('car-details'));
                    break;
                case 'summary':
                    dispatch(setStep('service-type'));
                    break;
            }
        } catch (err) {
            setError('Failed to go back');
        }
    };

    const handleCarDetailsSubmit = (carDetails: AppState['carDetails']) => {
        try {
            dispatch(setCarDetails({ carDetails: carDetails}));
            dispatch(setStep('service-type'));
        } catch (err) {
            setError('Failed to submit car details');
        }
    };

    const handleServiceDetailsSubmit = (serviceDetails: AppState['serviceDetails']) => {
        try {
            dispatch(setServiceDetails({ serviceDetails: serviceDetails }));
            dispatch(setStep('summary'));
        } catch (err) {
            setError('Failed to submit service details');
        }
    };

    const handleConfirmBooking = () => {
        try {
            const newBookingRef = 'BK' + Math.random().toString(36).substring(2, 10).toUpperCase();
            setBookingReference(newBookingRef);
            setShowConfirmation(true);
        } catch (err) {
            setError('Failed to confirm booking');
        }
    };

    const handleConfirmationDone = async () => {
        const datas = {
            customer_id: userId,
            choose_state: selectedState?.name,
            choose_city: selectedArea?.name,
            center_id: selectedCenter?.id,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            car_brand: carDetails?.brand,
            car_model: carDetails?.model,
            manufacturing_year: carDetails?.year,
            car_number: carDetails?.plateNumber,
            services: serviceDetails?.selectedServices,
            remark: serviceDetails?.remarks,
            packageType:serviceDetails?.packageType,
            reference_no: bookingReference
        }
        await api.post(`/customer/booking`, datas).then((response) => {
            toast.success(response.data.message)
            setShowConfirmation(false);
            setBookingReference(null);
            dispatch(resetBooking());
            setShowBookingHistory(true);
        }).catch((error: any) => {
            setShowConfirmation(true);
        })
    };

    const handleSignUpClick = () => {
        setIsSignUp(true);
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setIsSignUp(false);
    };

    const handleViewBookingHistory = () => {
        setShowBookingHistory(true);
    };

    const handleBackFromBookingHistory = () => {
        setShowBookingHistory(false);
    };

    const renderStep = () => {
        if (!isLoggedIn) {
            return <Login
            onLoginSuccess={handleLoginSuccess}
            onForgotPasswordClick={handleForgotPasswordClick}
            onSignUpClick={handleSignUpClick}
            />;
        }
        if (showForgotPassword) {
            return <ForgotPassword onBackToLogin={handleBackToLogin} />;
        }
        if (isSignUp) {
            return <SignUp onSignUpSuccess={handleBackToLogin} onBackToLogin={handleBackToLogin} />;
        }

        if (showBookingHistory) {
            return <BookingHistory onBack={handleBackFromBookingHistory} />;
        }

        try {
            switch (currentStep) {
                case 'login':
                    return <Login onLoginSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} onForgotPasswordClick={handleForgotPasswordClick} />;

                case 'location':
                    return <LocationStep
                        key={Date.now()}
                        onContinue={handleLocationSelect}
                        onLogout={handleLogout}
                        onViewBookingHistory={handleViewBookingHistory}
                        bookingState={selectedState}
                        bookingArea={selectedArea}
                    />;

                case 'appointment':
                    if (!selectedCenter) {
                        dispatch(setStep('location'));
                        return null;
                    }
                    return (
                        <AppointmentBooking
                            serviceCenter={selectedCenter}
                            onBack={handleBack}
                            onContinue={handleAppointmentSelect}
                            onLogout={handleLogout}
                            onViewBookingHistory={handleViewBookingHistory}
                            bookingDate={appointmentDate}
                            bookingTime={appointmentTime}
                        />
                    );

                case 'car-details':
                    console.log('Rendering CarDetails component');
                    return (
                        <CarDetails
                            onBack={handleBack}
                            onContinue={handleCarDetailsSubmit}
                            onLogout={handleLogout}
                            onViewBookingHistory={handleViewBookingHistory}
                            bookingCarBrand={carDetails?.brand || ''}
                            bookingCarModel={carDetails?.model || ''}
                            bookingCarYear={carDetails?.year || ' '}
                            bookingCarNumber={carDetails?.plateNumber || ''}
                        />
                    );

                case 'service-type':
                    return (
                        <ServiceType
                            onBack={() => dispatch(setStep('car-details'))}
                            onContinue={handleServiceDetailsSubmit}
                            onLogout={handleLogout}
                            onViewBookingHistory={handleViewBookingHistory}
                            serviceStateDetails={serviceDetails?.selectedServices || []}
                            serviceRemark={serviceDetails?.remarks || '' }
                            servicePackage={serviceDetails?.packageType || 'A' }
                        />
                    );

                case 'summary':
                    if (!selectedCenter || !carDetails || !serviceDetails || !appointmentDate || !appointmentTime) {
                        console.error('Missing required details for summary');
                        setError('Missing booking details');
                        return null;
                    }
                    return (
                        <Summary
                            onBack={() => dispatch(setStep('service-type'))}
                            onConfirm={handleConfirmBooking}
                            onLogout={handleLogout}
                            onViewBookingHistory={handleViewBookingHistory}
                            bookingDetails={{
                                serviceCenter: {
                                    name: selectedCenter.name,
                                    address: selectedCenter.address
                                },
                                vehicle: {
                                    model: `${carDetails.brand} ${carDetails.model}`,
                                    year: carDetails.year,
                                    plateNumber: carDetails.plateNumber
                                },
                                services: serviceDetails,
                                appointment: {
                                    date: appointmentDate,
                                    time: appointmentTime
                                }
                            }}
                        />
                    );

                default:
                    return null;
            }
        } catch (err) {
            setError('Failed to render step');
            return <div>Something went wrong. Please try again.</div>;
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <Router>
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
                    {/* Main App Routes */}
                    <Route
                        path="/"
                        element={
                            <div className="min-h-screen bg-gray-100">
                                {renderStep()}
                                {showConfirmation && bookingReference && (
                                    <BookingConfirmation
                                        bookingReference={bookingReference}
                                        appointmentDate={appointmentDate!}
                                        appointmentTime={appointmentTime!}
                                        onDone={handleConfirmationDone}
                                    />
                                )}
                            </div>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
            <ToastContainer
                position="bottom-center"
                autoClose={1000}
                hideProgressBar={true}
                pauseOnFocusLoss={true}
                theme="dark"
            />
        </>
    );
};

export default App;