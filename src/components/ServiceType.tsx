import React, { useEffect, useState } from 'react';
import MobileContainer from './MobileContainer';
import Header from './Header';
import PackageA from '../assets/package-a.png';
import api from "../services/customer_api";
import { toast } from 'react-toastify';

interface ServiceTypeProps {
    onBack: () => void;
    onContinue: (serviceDetails: {
        selectedServices: string[];
        remarks: string;
        packageType:string;
    }) => void;
    onLogout: () => void;
    onViewBookingHistory: () => void;
    serviceStateDetails: any;
    serviceRemark: any,
    servicePackage: string,
}
interface Service {
    id: number;
    name: string;
}

const ServiceType: React.FC<ServiceTypeProps> = ({
    onBack,
    onContinue,
    onLogout,
    onViewBookingHistory,
    serviceStateDetails,
    serviceRemark,
    servicePackage
}) => {
    const [selectedServices, setSelectedServices] = useState<string[]>(serviceStateDetails || []);
    const [remarks, setRemarks] = useState(serviceRemark || '');
    const [packageType, setPackageType] = useState(servicePackage || 'A');
    const [services, setServices] = useState<Service[]>([]);

    const handleServiceToggle = (service: string) => {
        setSelectedServices(prev => {
            if (prev.includes(service)) {
                return prev.filter(s => s !== service);
            } else {
                return [...prev, service];
            }
        });
    };
    const fetchServices = async() => {
        await api.get('/customer/serviceDetails').then((response) => {
            const data = response.data.data;
            console.log(data);
            
            setServices(data);
        }).catch((error) => {
            toast.error(`${error}`);
            setServices([]);
        })
    }
    const handleContinue = () => {       
        // if (selectedServices.length > 0) {
            onContinue({
                selectedServices,
                remarks,
                packageType
            });
        // }
    };
    useEffect(() => {
        fetchServices()
    }, [])
    return (
        <MobileContainer>
            <div className="min-h-screen bg-gray-50">
                <Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} />
                <div className="flex flex-col h-full">
                    {/* Progress Steps */}
                    <div className="px-4 py-4 border-b bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex-1 flex items-center">
                                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
                                <div className="flex-1 h-0.5 bg-green-500"></div>
                            </div>
                            <div className="flex-1 flex items-center">
                                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
                                <div className="flex-1 h-0.5 bg-green-500"></div>
                            </div>
                            <div className="flex-1 flex items-center">
                                <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">3</div>
                                <div className="flex-1 h-0.5 bg-green-500"></div>
                            </div>
                            <div className="flex-1 flex items-center">
                                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">4</div>
                                <div className="flex-1 h-0.5 bg-gray-300"></div>
                            </div>
                            <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-sm">5</div>
                        </div>

                        <div className="mt-2 flex justify-between text-xs">
                            <span className="text-green-500">Location</span>
                            <span className="text-green-500">Appointment</span>
                            <span className="text-green-500">Car Details</span>
                            <span className="text-blue-500">Service Type</span>
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
                                <h2 className="text-lg font-semibold ml-3">I'm Looking For...</h2>
                            </div>

                            {/* Service Packages */}
                            <div className="mb-6">
                                {/* <button
                                    className="w-full bg-blue-50 p-4 rounded-lg flex items-center justify-between text-blue-600"
                                    onClick={() => { }}
                                >
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        Choose from Our Service Packages
                                    </div>
                                    {<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>}
                                </button> */}
                                <div className="mt-4 space-y-2">
                                    
                                        <label key={'A'} className="flex items-center space-x-2">
                                        <input type="radio" name="servicePackage" value={packageType} className="form-radio text-blue-600"  defaultChecked={packageType == 'A'}/>
                                        <strong>Package A</strong>
                                    </label>
                                    <img src={PackageA} className='mx-auto'/> 
                                </div>
                            </div>

                            {/* Specific Services */}
                            <div className="mb-6">
                                <h3 className="text-base font-medium mb-2">Other Services</h3>
                                <p className="text-sm text-gray-500 mb-4">You can select more than one</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {services && services.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => handleServiceToggle(service.name)}
                                            className={`p-3 rounded-lg border text-left ${selectedServices.includes(service.name)
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300'
                                                }`}
                                        >
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="mb-6">
                                <h3 className="text-base font-medium mb-1">Remarks <span className="text-gray-500">(Optional)</span></h3>
                                <p className="text-sm text-gray-500 mb-2">Is there anything specific that you would like to get fixed? e.g. timing belt issues, alignment issues, etc.</p>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Enter your remarks here..."
                                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={handleContinue}
                                disabled={packageType ===''}
                                className={`w-full py-2 px-4 rounded-md text-white text-sm font-medium ${packageType !== ''
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

export default ServiceType; 