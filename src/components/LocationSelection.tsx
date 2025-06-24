import React, { useState, useEffect } from 'react';
import { malaysiaStates, State, Area } from '../data/malaysiaLocations';

interface LocationSelectionProps {
  onContinue: (state: State, area: Area) => void;
}

const LocationSelection: React.FC<LocationSelectionProps> = ({ onContinue }) => {
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    if (selectedState) {
      setAreas(selectedState.areas);
      setSelectedArea(null);
    }
  }, [selectedState]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = malaysiaStates.find(s => s.id === e.target.value);
    setSelectedState(state || null);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const area = areas.find(a => a.id === e.target.value);
    setSelectedArea(area || null);
  };

  const handleContinue = () => {
    if (selectedState && selectedArea) {
      onContinue(selectedState, selectedArea);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <button className="text-blue-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Select Location</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <select
                id="state"
                value={selectedState?.id || ''}
                onChange={handleStateChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select State</option>
                {malaysiaStates.map(state => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <select
                id="area"
                value={selectedArea?.id || ''}
                onChange={handleAreaChange}
                disabled={!selectedState}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Area</option>
                {areas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedState || !selectedArea}
            className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelection; 