import React, { useState } from 'react';
import { serviceCenters, servicePackages, carBrands } from '../data/serviceData';
import { CalendarCheck, MapPin, Car, PenTool as Tools, Check } from 'lucide-react';

interface SummaryStepProps {
  bookingData: {
    centerId: string;
    carDetails: {
      brand: string;
      model: string;
      year: string;
      plateNumber: string;
    };
    serviceType: string;
  };
  onConfirm: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ bookingData, onConfirm }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const center = serviceCenters.find(c => c.id === bookingData.centerId);
  const service = servicePackages.find(s => s.id === bookingData.serviceType);
  const brand = carBrands.find(b => b.id === bookingData.carDetails.brand);

  const handleConfirm = () => {
    setShowConfirmation(true);
    onConfirm();
  };

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-6">
            Your service appointment has been successfully scheduled.
          </p>
          <div className="bg-gray-50 w-full p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Booking Reference:</span>
              <span className="font-semibold">BK{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointment:</span>
              <span className="font-semibold">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
          <button
            className="w-full py-3 rounded-lg text-white font-medium bg-blue-500 hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">Booking Summary</h2>

      <div className="space-y-6 mb-8">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold">Service Center</h3>
            <p className="text-gray-600 text-sm">{center?.name}</p>
            <p className="text-gray-600 text-sm">{center?.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Car className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold">Vehicle Details</h3>
            <p className="text-gray-600 text-sm">
              {brand?.name} {bookingData.carDetails.model} ({bookingData.carDetails.year})
            </p>
            <p className="text-gray-600 text-sm">
              Plate Number: {bookingData.carDetails.plateNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Tools className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold">Service Details</h3>
            <p className="text-gray-600 text-sm">{service?.name}</p>
            <p className="text-gray-600 text-sm">{service?.description}</p>
            <p className="text-blue-600 font-semibold mt-1">
              RM {service?.price.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <CalendarCheck className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h3 className="font-semibold">Appointment Time</h3>
            <p className="text-gray-600 text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-gray-600 text-sm">10:00 AM</p>
          </div>
        </div>
      </div>

      <button
        className="w-full py-3 rounded-lg text-white font-medium bg-blue-500 hover:bg-blue-600"
        onClick={handleConfirm}
      >
        Confirm Booking
      </button>

      {showConfirmation && <ConfirmationModal />}
    </div>
  );
};

export default SummaryStep;