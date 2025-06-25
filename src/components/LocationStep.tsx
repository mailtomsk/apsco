import React, { useState, useMemo, useEffect } from 'react';
import MobileContainer from './MobileContainer';
import Header from './Header';
import { State, Area } from '../data/malaysiaLocations';
import { ServiceCenter } from '../data/serviceCenters';
import ServiceCenterCard from './ServiceCenterCard';
import api from "../services/customer_api";
import { toast } from 'react-toastify';

interface LocationStepProps {
    onContinue: (state: State, area: Area, center: ServiceCenter) => void;
    onLogout: () => void;
    onViewBookingHistory: () => void;
    bookingState: any;
    bookingArea: any;
}

const LocationStep: React.FC<LocationStepProps> = ({
    onContinue,
    onLogout,
    onViewBookingHistory,
    bookingState,
    bookingArea
}) => {
    const [states, setStates] = useState<State[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [selectedState, setSelectedState] = useState<State | null>(bookingState || null);
    const [selectedArea, setSelectedArea] = useState<Area | null>(bookingArea || null);
    const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
    
    const fetchLocation = async () => {
        await api.get('/customer/service-location-state').then((response) => {
            const data = response.data.data;
            setStates(data.allState);
            setAreas(data.allCity);
        }).catch((error) => {
            toast.error(`${error}`);
            setStates([]);
            setAreas([]);
        })
    }

    const fetchCenter = async (selectedState_name: string, selectedArea_name: string) => {
        await api.get(`/customer/service-center?state=${selectedState_name}&area=${selectedArea_name}`).then((response) => {
            const data = response.data.data;
            setServiceCenters(data);
        }).catch((error: any) => {
            setAreas([]);
        })
    }
    
    const filteredAreas = useMemo(() => {
        if (!selectedState) return [];
        return areas.filter((area: Area) => area.state.name === selectedState.name);
    }, [selectedState, areas]);

    const filteredCenters = useMemo(() => {
        if (!selectedState || !selectedArea) return [];
        return serviceCenters.filter(
            center => center.state === selectedState.name && center.area === selectedArea.name
        );
    }, [selectedState, selectedArea, serviceCenters]);
    useEffect(() => {
        fetchLocation();
        if (selectedState && selectedArea) {
            fetchCenter(selectedState.name, selectedArea.name);
        }
    }, [selectedState, selectedArea])

    return (
        <MobileContainer>
            <div className="min-h-screen bg-white">
                <Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} hideBack={true}/>

                <div className="p-4 flex flex-col h-full w-full max-w-[420px] mx-auto">
                    {/* State Selection */}
                    <div className="mb-6 relative">
                        <label htmlFor="state" className="block text-[15px] text-gray-800 mb-2">
                            Select State
                        </label>
                        <select
                            id="state"
                            value={selectedState?.name || ''}
                            onChange={(e) => {
                                const state = states.find((s: State) => s.name === e.target.value);
                                setSelectedState(state || null);
                                setSelectedArea(null);
                            }}
                            className="block appearance-none w-full px-3 py-2 cursor-pointer bg-white border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[17px] text-gray-800"
                        >
                            <option value="">Select a state</option>
                            {states.map((state: State) => (
                                <option key={state.name} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute top-[75%] right-3 transform -translate-y-1/2 text-gray-600">
                            <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 7l3 3 3-3" />
                            </svg>
                        </div>
                    </div>

                    {/* Area Selection */}
                    {selectedState && (
                        <div className="mb-6 relative">
                            <label htmlFor="area" className="block text-[15px] text-gray-800 mb-2">
                                Select Area
                            </label>
                            <select
                                id="area"
                                value={selectedArea?.name || ''}
                                onChange={(e) => {
                                    const area = areas.find((a: Area) => a.name === e.target.value);
                                    setSelectedArea(area || null);
                                }}
                                className="block appearance-none w-full px-3 py-2 cursor-pointer bg-white border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-[17px] text-gray-800"
                            >
                                <option value="">Select an area</option>
                                {filteredAreas.map((area: Area) => (
                                    <option key={area.name} value={area.name}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute top-[75%] right-3 transform -translate-y-1/2 text-gray-600">
                                <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M7 7l3 3 3-3" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Service Centers */}
                    {selectedState && selectedArea && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Service Centers</h2>
                            <div className="space-y-4">
                                {filteredCenters.map((center) => (
                                    <ServiceCenterCard
                                        key={center.id}
                                        center={center}
                                        onClick={() => onContinue(selectedState, selectedArea, center)}
                                    />
                                ))}
                                {filteredCenters.length === 0 && (
                                    <p className="text-center text-gray-600 py-8">
                                        No service centers available in this area.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MobileContainer>
    );
};

export default LocationStep; 