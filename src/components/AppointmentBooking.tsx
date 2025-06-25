import React, { useState, useEffect } from 'react';
import { ServiceCenter } from '../data/serviceCenters';
import Header from './Header';
import MobileContainer from './MobileContainer';
import { setStep } from "../auth/bookingSlice";
import { useAppDispatch } from "../hooks";
import StepProgress from './StepProgress';

interface AppointmentBookingProps {
    serviceCenter: ServiceCenter;
    onBack: () => void;
    onContinue: (date: string, timeSlot: string) => void;
    onLogout: () => void;
    onViewBookingHistory: () => void;
    bookingDate: any
    bookingTime: any
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
    serviceCenter,
    onBack,
    onContinue,
    onLogout,
    onViewBookingHistory,
    bookingDate,
    bookingTime
}) => {
    const [selectedDate, setSelectedDate] = useState(bookingDate || '');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(bookingTime || '');
    const [error, setError] = useState<string | null>(null);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    useEffect(() => {
        stolTimeManage(selectedDate)
    }, [selectedDate, selectedTimeSlot, serviceCenter]);

    // Get next 10 days
    const getNext30Days = () => {
        try {
            const days = [];
            const today = new Date();

            for (let i = 1; i < 10; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                days.push({
                    date: date.toISOString().split('T')[0],
                    display: date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    })
                });
            }
            return days;
        } catch (err) {
            console.error('Error generating dates:', err);
            setError('Failed to generate available dates');
            return [];
        }
    };
    const dispatch = useAppDispatch();
    const currentSteps = (currentStepString: string) => {
        dispatch(setStep(currentStepString));
    };
    const availableDates = getNext30Days();

    const handleDateSelect = (date: string) => {
        try {
            setSelectedDate(date);
            setSelectedTimeSlot('');
            setError(null);
            stolTimeManage(date)
        } catch (err) {
            setError('Failed to select date');
        }
    };

    const handleTimeSlotSelect = (slot: string) => {
        try {
            setSelectedTimeSlot(slot);
            setError(null);
        } catch (err) {
            setError('Failed to select time slot');
        }
    };

    const handleContinue = () => {
        try {
            if (selectedDate && selectedTimeSlot) {
                onContinue(selectedDate, selectedTimeSlot);
            } else {
                setError('Please select both date and time slot');
            }
        } catch (err) {
            setError('Failed to proceed to next step');
        }
    };
    function stolTimeManage(date: string) {
        const dates = new Date(date);
        const dayOfWeek = dates.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const weekdayData: string[] = generateTimeSlotsFromRange(serviceCenter.working_weekdays, 60);
            if (weekdayData.length > 0) {
                setTimeSlots(weekdayData);
            } else {
                setTimeSlots([])
            }
        } else if (dayOfWeek === 6) {
            const saturdayData: string[] = generateTimeSlotsFromRange(serviceCenter.working_saturday, 60);
            if (saturdayData.length > 0) {
                setTimeSlots(saturdayData);
            } else {
                setTimeSlots([])
            }
        } else if (dayOfWeek === 0) {
            if (serviceCenter.working_sunday.trim() === 'Closed') {
                setTimeSlots([])
            } else {
                const sundayData: string[] = generateTimeSlotsFromRange(serviceCenter.working_sunday, 60);
                if (sundayData.length > 0) {
                    setTimeSlots(sundayData);
                } else {
                    setTimeSlots([])
                }
            }
        } 
    }
    function generateTimeSlotsFromRange(range: string, intervalMinutes: number): string[] {
        const [startTime, endTime] = range.split("-").map(str => str.trim());
        if (!startTime || !endTime) {
            return [];
        }
        return generateTimeSlots(startTime, endTime, intervalMinutes);
    }
    function convertTo24Hour(timeStr: string): string {
        const [time, modifier] = timeStr.split(" ");
        let [hoursStr, minutesStr] = time.split(":");
        let hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
        if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    function formatTime(date: Date): string {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12; // convert 0 to 12
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    function generateTimeSlots(startTime: string, endTime: string, intervalMinutes: number): string[] {
        const slots: string[] = [];
        let start = new Date(`1970-01-01T${convertTo24Hour(startTime)}:00`);
        const end = new Date(`1970-01-01T${convertTo24Hour(endTime)}:00`);
        while (start < end) {
            const endSlot = new Date(start.getTime() + intervalMinutes * 60000);
            slots.push(formatTime(start));
            start = endSlot;
        }
        return slots;
    }

    if (error) {
        return (
            <MobileContainer>
                <div className="p-4 text-center">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button
                        onClick={() => setError(null)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </MobileContainer>
        );
    }

    return (
        <MobileContainer>
            <div className="min-h-screen bg-white">
                <Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} onBack={onBack}/>
                <div className="flex flex-col h-full w-full max-w-[420px] mx-auto">
                    <StepProgress/>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="p-4">
                            <div className="flex items-center mb-4">
                                
                                <h2 className="text-lg font-semibold">Select Appointment</h2>
                            </div>

                            {/* Service Center Info */}
                            <div className="mb-6 bg-blue-50 border border-blue-500 py-3 px-4">
                                <h3 className="text-[18px] text-gray-800">{serviceCenter.name}</h3>
                                <p className="text-[15px] text-gray-600 mt-1">{serviceCenter.address}</p>
                                <p className="text-[15px] text-gray-600">{serviceCenter.area}, {serviceCenter.state} {/*serviceCenter.postalCode*/ }</p>
                            </div>

                            {/* Date Selection */}
                            <div className="mb-6">
                                <label className="block text-[18px] text-gray-800 mb-2">
                                    Select a Date
                                </label>
                                <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
                                    {availableDates
                                        .filter((day) => {
                                            const isSunday = new Date(day.date).getDay() === 0;
                                            const isWorkingSunday = serviceCenter.working_sunday !== 'Closed';
                                            return isWorkingSunday || !isSunday;
                                        })
                                        .map((day) => (
                                        <button
                                            key={day.date}
                                            onClick={() => handleDateSelect(day.date)}
                                            className={`flex-shrink-0 px-4 py-2 border ${selectedDate === day.date
                                                    ? 'border-blue-500 bg-blue-50 text-gray-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                                <div className="text-[16px] text-gray-800">{day.display}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots */}
                            {/* {selectedDate && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-base font-medium ml-2">Morning</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots.morning.map((slot) => (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => handleTimeSlotSelect(slot.time)}
                                                    disabled={!slot.available}
                                                    className={`p-2 text-sm text-center border rounded-md transition-colors ${selectedTimeSlot === slot.time
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : slot.available
                                                                ? 'hover:border-gray-400 text-gray-900'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-3">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span className="text-base font-medium ml-2">Afternoon</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots.afternoon.map((slot) => (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => handleTimeSlotSelect(slot.time)}
                                                    disabled={!slot.available}
                                                    className={`p-2 text-sm text-center border rounded-md transition-colors ${selectedTimeSlot === slot.time
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : slot.available
                                                                ? 'hover:border-gray-400 text-gray-900'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center mb-3">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                            <span className="text-base font-medium ml-2">Evening</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots.evening.map((slot) => (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => handleTimeSlotSelect(slot.time)}
                                                    disabled={!slot.available}
                                                    className={`p-2 text-sm text-center border rounded-md transition-colors ${selectedTimeSlot === slot.time
                                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                            : slot.available
                                                                ? 'hover:border-gray-400 text-gray-900'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )} */}
                            {selectedDate && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <span className="text-[18px] text-gray-800 ml-2">Select a Time</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots && timeSlots
                                                .map((slot) => (
                                                <button
                                                    key={slot}
                                                    onClick={() => handleTimeSlotSelect(slot)}
                                                    disabled={!slot}
                                                        className={`p-2 text-[16px] text-gray-800 text-center border transition-colors ${selectedTimeSlot === slot
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : slot
                                                            ? 'hover:border-gray-400 text-gray-900'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleContinue}
                                disabled={!selectedDate || !selectedTimeSlot}
                                className={`w-full mt-6 py-2 px-4 rounded-md text-white text-sm font-medium ${selectedDate && selectedTimeSlot
                                        ? 'bg-blue-500 hover:bg-blue-600'
                                        : 'bg-gray-300 cursor-not-allowed'
                                    }`}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MobileContainer>
    );
};

export default AppointmentBooking; 