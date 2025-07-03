import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import RegisterComplete from './pages/RegisterComplete';

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
    let userId = localStorage.getItem('customer_id');

    const [error, setError] = useState<string | null>(null);
    const [bookingReference, setBookingReference] = useState<string | null>(null);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const [isSignUp, setIsSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    let [showBookingHistory, setShowBookingHistory] = useState(false);
    const [showLoginAtSummary, setShowLoginAtSummary] = useState(false);
    const [pendingBooking, setPendingBooking] = useState(false);
    
    let currentStep = useAppSelector((state) => state.auth.booking.step as Step);
    const isLoggedIn = useAppSelector((state) => state.auth.customerAuth?.isLoggedIn);
    const { selectedState, selectedArea, selectedCenter } = useAppSelector((state) => state.auth.booking);
    const { appointmentDate, appointmentTime } = useAppSelector((state) => state.auth.booking);
    const { carDetails } = useAppSelector((state) => state.auth.booking);
    const { serviceDetails } = useAppSelector((state) => state.auth.booking);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (token && userId) {
            dispatch(restoreCustomerSession());
        }
    }, [dispatch, token, userId, currentStep]);

    useEffect(() => {
        if (pendingBooking && isLoggedIn) {
            setPendingBooking(false);
            setShowLoginAtSummary(false);
            handleConfirmBooking(true);
        }
    }, [pendingBooking, isLoggedIn]);

    const handleLoginSuccess = () => {
        setShowLoginAtSummary(false);
        if (pendingBooking) {
            setPendingBooking(false);
            handleConfirmBooking(true);
        }
    };

    const handleLogout = () => {
        dispatch(setAppointment({ appointmentDate: null, appointmentTime: null }));
        dispatch(setLocation({ selectedState: null, selectedArea: null, selectedCenter: null }));
        dispatch(setCarDetails({ carDetails: null }));
        dispatch(setServiceDetails({ serviceDetails: null }));
        dispatch(logoutCustomer());
        dispatch(setStep('location'));
        setShowBookingHistory(false);
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

    const handleConfirmBooking = (skipLoginCheck = false) => {
        
        if (!isLoggedIn && !skipLoginCheck) {
            setShowLoginAtSummary(true);
            setPendingBooking(true);
            return;
        } 
        setShowConfirmation(true);
    };

    const handleLoginConfirmBooking = async () => {
        setShowConfirmation(true);
        await handleConfirmationDone();
    }

    const handleConfirmationDone = async () => {
        if(!userId) {
            userId = localStorage.getItem("customer_id");
        }
        const newBookingRef = 'BK' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setBookingReference((prev) => prev !== newBookingRef ? newBookingRef: '');
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
            reference_no: newBookingRef
        }
        await api.post(`/customer/booking`, datas).then((response) => {
            toast.success(response.data.message)
            //setShowConfirmation(false);
            //setBookingReference(null);
            //dispatch(resetBooking());
            //setShowBookingHistory(true);
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

    const handleLogin = () => {
        navigate('/login');
    }
    
    const handleViewLocation = () => {
        setShowBookingHistory(false);
        dispatch(setStep('location'));
    }

    const handleBackToLocation = () => {
        navigate('/');
    }

    const handleForgotPasswordPageClick = () => {
        navigate('/forgot-paasword');
    }

    const handleSignUpPageClick = () => {
        navigate('/signup');
    }

    const renderStep = () => {
        if (showForgotPassword) {
            return <ForgotPassword onBackToLogin={handleBackToLogin} />;
        }
        if (isSignUp) {
            return <SignUp onBackToLogin={handleBackToLogin} onLoginSuccess={handleLoginSuccess}/>;
        }
        if (showBookingHistory) {
            return <BookingHistory onBack={handleBackFromBookingHistory} onLogout={handleLogout}
            onViewBookingHistory={handleViewBookingHistory} onViewLocation={handleViewLocation}/>;
        }
        try {
            switch (currentStep) {
                case 'login':
                    return <Login onLoginSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} onForgotPasswordClick={handleForgotPasswordClick} onDone={handleConfirmationDone}/>;
                case 'location':
                    return <LocationStep
                        key={Date.now()}
                        onContinue={handleLocationSelect}
                        onLogout={handleLogout}
                        onViewBookingHistory={handleViewBookingHistory}
                        bookingState={selectedState}
                        bookingArea={selectedArea}
                        onLogin={handleLogin}
                        onViewLocation={handleViewLocation}
                        currentStep={currentStep}
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
                            onLogin={handleLogin}
                            onViewLocation={handleViewLocation}
                        />
                    );
                case 'car-details':
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
                            onLogin={handleLogin}
                            onViewLocation={handleViewLocation}
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
                            onLogin={handleLogin}
                            onViewLocation={handleViewLocation}
                        />
                    );
                case 'summary':
                    if (!selectedCenter || !carDetails || !serviceDetails || !appointmentDate || !appointmentTime) {
                        setError('Missing booking details');
                        return null;
                    }
                    return (
                        <>
                            <Summary
                                onBack={() => dispatch(setStep('service-type'))}
                                onConfirm={() => {
                                    if(!isLoggedIn) {
                                        handleConfirmBooking(false)
                                    } else {
                                        handleLoginConfirmBooking()
                                    }
                                }}
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
                                onLogin={handleLogin}
                                onViewLocation={handleViewLocation}
                            />
                            {showLoginAtSummary && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                        <Login
                                            onLoginSuccess={handleLoginSuccess}
                                            onForgotPasswordClick={handleForgotPasswordClick}
                                            onSignUpClick={handleSignUpClick}
                                            onDone={handleConfirmationDone}
                                        />
                                        <button className="mt-4 text-blue-500" onClick={() => setShowLoginAtSummary(false)}>Cancel</button>
                                    </div>
                                </div>
                            )}
                        </>
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
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/register-complete" element={<RegisterComplete handleBackToLogin={handleBackToLogin} onViewBookingHistory={handleViewBookingHistory}/>} />
                <Route path='/login' element={<Login onBack={handleBackToLocation} onLoginSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} onForgotPasswordClick={handleForgotPasswordClick} onSignUpPageClick={handleSignUpPageClick} onForgotPasswordPageClick={handleForgotPasswordPageClick} onDone={() => {
                    setShowConfirmation(false);
                    setBookingReference(null);
                    dispatch(resetBooking());
                    setShowBookingHistory(true);
                    navigate('/')
                }}/>} />
                <Route path="/forgot-paasword" element={<ForgotPassword onLoginPage={handleLogin} onBackToLogin={handleBackToLogin} />} />
                <Route path="/signup" element={<SignUp onLoginPage={handleLogin} onBackToLogin={handleBackToLogin} onLoginSuccess={handleLoginSuccess}/>} />
                {/* Main App Routes */}
                <Route
                    path="/"
                    element={
                        <div className="min-h-screen bg-white">
                            {renderStep()}
                            {showConfirmation && bookingReference && (
                                <BookingConfirmation
                                    bookingReference={bookingReference}
                                    appointmentDate={appointmentDate!}
                                    appointmentTime={appointmentTime!}
                                    onClose={() => {
                                        setShowConfirmation(false);
                                        setBookingReference(null);
                                        dispatch(resetBooking());
                                        setShowBookingHistory(true);
                                    }}
                                />
                            )}
                        </div>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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