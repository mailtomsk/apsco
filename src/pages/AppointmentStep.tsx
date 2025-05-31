import React, { useState } from 'react';
import { serviceCenters, timeSlots } from '../data/serviceData';
import ServiceCard from '../components/ServiceCard';
import { Sun, Clock } from 'lucide-react';

interface AppointmentStepProps {
  onNext: (centerId: string) => void;
}

const AppointmentStep: React.FC<AppointmentStepProps> = ({ onNext }) => {
  const [selectedCenter, setSelectedCenter] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleContinue = () => {
    if (selectedCenter && selectedDate && selectedTime) {
      onNext(selectedCenter);
    }
  };

  const TimeSlotButton: React.FC<{ time: string; available: boolean }> = ({ time, available }) => (
    <button
      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors
        ${selectedTime === time
          ? 'bg-blue-500 text-white'
          : available
            ? 'bg-gray-50 hover:bg-gray-100 text-gray-900'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      onClick={() => available && setSelectedTime(time)}
      disabled={!available}
    >
      {time}
    </button>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Service Center Location</h2>
      
      <div className="mb-6">
        {serviceCenters.map((center) => (
          <ServiceCard
            key={center.id}
            center={center}
            selected={selectedCenter === center.id}
            onClick={() => setSelectedCenter(center.id)}
          />
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select a Date</h3>
        <input
          type="date"
          className="w-full p-2 border rounded-lg"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {selectedDate && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sun className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Morning</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {timeSlots.morning.map((slot) => (
              <TimeSlotButton
                key={slot.time}
                time={slot.time}
                available={slot.available}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Afternoon</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.afternoon.map((slot) => (
              <TimeSlotButton
                key={slot.time}
                time={slot.time}
                available={slot.available}
              />
            ))}
          </div>
        </div>
      )}

      <button
        className={`w-full py-3 rounded-lg text-white font-medium
          ${selectedCenter && selectedDate && selectedTime
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-300 cursor-not-allowed'}`}
        onClick={handleContinue}
        disabled={!selectedCenter || !selectedDate || !selectedTime}
      >
        Continue
      </button>
    </div>
  );
};

export default AppointmentStep;