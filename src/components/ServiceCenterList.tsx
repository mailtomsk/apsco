import React from 'react';
import { ServiceCenter, serviceCenters } from '../data/serviceCenters';
import { State, Area } from '../data/malaysiaLocations';

interface ServiceCenterListProps {
  selectedState: State;
  selectedArea: Area;
  onSelectCenter: (center: ServiceCenter) => void;
}

const ServiceCenterList: React.FC<ServiceCenterListProps> = ({
  selectedState,
  selectedArea,
  onSelectCenter,
}) => {
  const filteredCenters = serviceCenters.filter(
    center => center.state === selectedState.name && center.area === selectedArea.name
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <button className="text-blue-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Service Center Location</h2>
            <div className="space-y-4">
              {filteredCenters.map(center => (
                <div
                  key={center.id}
                  className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => onSelectCenter(center)}
                >
                  <h3 className="text-lg font-semibold">{center.name}</h3>
                  <p className="text-gray-600 mt-1">{center.address}</p>
                  <p className="text-gray-600">{center.area}, {center.state} {center.postalCode}</p>
                </div>
              ))}
              {filteredCenters.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  No service centers found in {selectedArea.name}, {selectedState.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterList; 