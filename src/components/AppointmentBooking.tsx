import React, { useState, useEffect } from 'react';
import { ServiceCenter } from '../data/serviceCenters';
import Header from './Header';
import MobileContainer from './MobileContainer';
import { setStep } from "../auth/bookingSlice";
import { useAppDispatch } from "../hooks";
import StepProgress from './StepProgress';
import Calendars from 'react-calendar'
import { Calendar } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface AppointmentBookingProps {
    serviceCenter: ServiceCenter;
    onBack: () => void;
    onContinue: (date: string, timeSlot: string) => void;
    onLogout: () => void;
    onViewBookingHistory: () => void;
    bookingDate: any
    bookingTime: any
    onLogin: () => void;
    onViewLocation: () => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
    serviceCenter,
    onBack,
    onContinue,
    onLogout,
    onViewBookingHistory,
    bookingDate,
    bookingTime,
    onLogin,
}) => {
    const [selectedDate, setSelectedDate] = useState(bookingDate || '');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(bookingTime || '');
    const [error, setError] = useState<string | null>(null);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [value, setValue] = useState<Value>(bookingDate ? new Date(bookingDate) : new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        const weekday = date.toLocaleDateString('en-MY', { weekday: 'short' }); // Fri
        const month = date.toLocaleDateString('en-MY', { month: 'short' });     // Jul
        const day = date.getDate().toString().padStart(2, '0');                 // 18
        const year = date.getFullYear();         
        console.log(`${weekday}, ${month} ${day} ${year}`);                               // 2025
        return `${weekday}, ${month} ${day} ${year}`;
    };

    function formatToYYYYMMDD(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    useEffect(() => {
        if (value instanceof Date) {
            const dateStr = formatToYYYYMMDD(value);
            //if (dateStr !== selectedDate) {
                setSelectedDate(dateStr);
                //setSelectedTimeSlot('');
                stolTimeManage(dateStr);
            //}
        }
    }, [value]);

    useEffect(() => {
    if (bookingTime && timeSlots.includes(bookingTime)) {
        setSelectedTimeSlot(bookingTime);
    }
    }, [bookingTime, timeSlots]);

    // Get next 10 days
    /* const getNext30Days = () => {
        try {
            const days = [];
            const today = new Date();

            for (let i = 1; i < 10; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                days.push({
                    date: date.toISOString().split('T')[0],
                    display: date.toLocaleDateString('en-MY', {
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
    }; */
    /* const getNext30Days = () => {
        try {
            const days = [];
            const today = new Date();

            for (let i = 0; i < 200; i++) { // Start from 0 to include today
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                days.push({
                    date: date.toISOString().split('T')[0],
                    display: date.toLocaleDateString('en-MY', {
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
    }; */
    const getNextDaysForYears = (years: number) => {
        try {
            const days = [];
            const today = new Date();
            const endDate = new Date();
            endDate.setFullYear(today.getFullYear() + years);

            let currentDate = new Date(today);

            while (currentDate <= endDate) {
                days.push({
                    date: currentDate.toISOString().split('T')[0],
                    display: currentDate.toLocaleDateString('en-MY', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    })
                });
                currentDate.setDate(currentDate.getDate() + 1);
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
    const availableDates: string[] = getNextDaysForYears(10).map(d => d.date);

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
    
    console.log("Preselected time slot:", bookingTime);
console.log("Generated slots:", timeSlots);

    return (
        <MobileContainer>
            <div className="min-h-screen bg-white">
                <Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} onBack={onBack} onLogin={onLogin} />
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
                                <p className="text-[15px] text-gray-600">{serviceCenter.area}, {serviceCenter.state}</p>
                            </div>
                            
                            {/* Date Selection */}
                            <div className="mb-6">
                                <label className="block text-[18px] text-gray-800 mb-2">
                                    Select a Date
                                </label>
                                <div className="relative inline-block">
                                    <button
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100"
                                    >
                                        <Calendar className="w-5 h-5 text-gray-700" />
                                        <span className="text-sm text-gray-800">
                                        {selectedDate
                                            ? formatDate(new Date(selectedDate))
                                            : 'Select a date'}
                                        </span>
                                    </button>

                                    {showCalendar && (
                                        <div className="absolute top-full mb-2 z-10 bg-white shadow-md p-2 rounded">
                                            <Calendars
                                                className="text-sm scale-90"
                                                onChange={(val) => {
                                                    if (val instanceof Date) {
                                                    setValue(val);
                                                    const dateStr = formatToYYYYMMDD(val);
                                                    handleDateSelect(dateStr);
                                                    setShowCalendar(false);
                                                    }
                                                }}
                                                value={value}
                                                minDate={new Date()}
                                                tileDisabled={({ date, view }) => {
                                                    if (view === 'month') {
                                                    const dateStr = date.toISOString().split('T')[0];
                                                    const isSunday = date.getDay() === 0;
                                                    const isWorkingSunday = serviceCenter.working_sunday !== 'Closed';

                                                        return (
                                                            (!availableDates.includes(dateStr)) || // Disable if not in availableDates
                                                            (isSunday && !isWorkingSunday)         // Optional: disable unworking Sundays
                                                        );
                                                    }
                                                    return false;
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            
                            {value && timeSlots.length > 0 && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <span className="text-[18px] text-gray-800 ml-2">Select a Time</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots.map((slot) => (
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
                                disabled={!selectedDate || !selectedTimeSlot || timeSlots.length === 0}
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