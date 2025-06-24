import React, { useState, useEffect } from 'react';
import MobileContainer from './MobileContainer';
import Header from './Header';
import { ServiceCenter } from '../data/serviceCenters';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentStepProps {
  serviceCenter: ServiceCenter;
  onBack: () => void;
  onContinue: (date: string, timeSlot: string) => void;
  onLogout: () => void;
}

const AppointmentStep: React.FC<AppointmentStepProps> = ({
  serviceCenter,
  onBack,
  onContinue,
  onLogout
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Get next 30 days
  const getNext30Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
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
  };

  const availableDates = getNext30Days();

  // Format today's date as YYYY-MM-DD
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  // Calculate max date (30 days from today)
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  const formattedMaxDate = maxDate.toISOString().split('T')[0];

  // Format the selected date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock time slots - in a real app, these would come from an API based on the selected date
  const timeSlots = {
    morning: [
      { time: "06:30 AM", available: true },
      { time: "07:00 AM", available: true },
      { time: "07:30 AM", available: true },
      { time: "08:00 AM", available: true },
      { time: "08:30 AM", available: true },
      { time: "09:00 AM", available: true },
      { time: "09:30 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "10:30 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "11:30 AM", available: true }
    ],
    afternoon: [
      { time: "12:00 PM", available: true },
      { time: "12:30 PM", available: true },
      { time: "01:00 PM", available: true },
      { time: "01:30 PM", available: true },
      { time: "02:00 PM", available: true },
      { time: "02:30 PM", available: false },
      { time: "03:00 PM", available: false }
    ],
    evening: [
      { time: "03:30 PM", available: true },
      { time: "04:00 PM", available: true },
      { time: "04:30 PM", available: true },
      { time: "05:00 PM", available: true },
      { time: "05:30 PM", available: true }
    ]
  };

  const handleContinue = () => {
    if (selectedDate && selectedTimeSlot) {
      onContinue(selectedDate, selectedTimeSlot);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot('');
  };

  const renderTimeSlots = (slots: TimeSlot[], title: string, icon: JSX.Element) => (
    <div>
      <div className="flex items-center mb-3">
        {icon}
        <span className="text-base font-medium ml-2">{title}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.available && setSelectedTimeSlot(slot.time)}
            disabled={!slot.available}
            className={`p-2 text-sm text-center border rounded-md transition-colors ${
              selectedTimeSlot === slot.time
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
  );

  return (
    <MobileContainer>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <Header onLogout={onLogout} />
        </div>

        {/* Progress Steps */}
        <div className="px-4 py-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
              <div className="flex-1 h-0.5 bg-green-500"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm">3</div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
            </div>
            <div className="flex-1 flex items-center">
              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm">4</div>
              <div className="flex-1 h-0.5 bg-gray-300"></div>
            </div>
            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm">5</div>
          </div>

          <div className="mt-2 flex justify-between text-xs">
            <span className="text-green-500">Location</span>
            <span className="text-blue-500">Appointment</span>
            <span className="text-gray-500">Car Details</span>
            <span className="text-gray-500">Service Type</span>
            <span className="text-gray-500">Summary</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <button 
                onClick={onBack}
                className="flex items-center text-blue-500"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h2 className="text-lg font-semibold ml-3">Select Appointment</h2>
            </div>

            {/* Service Center Info */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium">{serviceCenter.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{serviceCenter.address}</p>
              <p className="text-sm text-gray-600">{serviceCenter.area}, {serviceCenter.state} {serviceCenter.postalCode}</p>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a Date
              </label>
              <div className="flex overflow-x-auto pb-2 -mx-4 px-4 space-x-2">
                {availableDates.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => handleDateSelect(day.date)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg border-2 ${
                      selectedDate === day.date
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{day.display}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="space-y-6">
                {renderTimeSlots(timeSlots.morning, "Morning", (
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ))}

                {renderTimeSlots(timeSlots.afternoon, "Afternoon", (
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ))}

                {renderTimeSlots(timeSlots.evening, "Evening", (
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ))}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!selectedDate || !selectedTimeSlot}
              className={`w-full mt-6 py-2 px-4 rounded-md text-white text-sm font-medium ${
                selectedDate && selectedTimeSlot
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
};

export default AppointmentStep; 