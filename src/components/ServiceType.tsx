import React, { useEffect, useState } from 'react';
import MobileContainer from './MobileContainer';
import Header from './Header';
import PackageA from '../assets/package-a.png';
import PackageB from '../assets/package-b.png';
import PackageF from '../assets/package-f.png';
import api from "../services/customer_api";
import { toast } from 'react-toastify';
import { setStep } from "../auth/bookingSlice";
import { useAppDispatch } from "../hooks";
import StepProgress from './StepProgress';

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
    onLogin: () => void;
    onViewLocation: () => void;
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
    servicePackage,
    onLogin,
    onViewLocation,
}) => {
    const [selectedServices, setSelectedServices] = useState<string[]>(serviceStateDetails || []);
    const [remarks, setRemarks] = useState(serviceRemark || '');
    const [packageType, setPackageType] = useState(servicePackage || '');
    const [services, setServices] = useState<Service[]>([]);
    const dispatch = useAppDispatch();
    const currentSteps = (currentStepString: string) => {
        dispatch(setStep(currentStepString));
    };
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
    const packageImages: { [key: string]: string } = {
        A: PackageA,
        B: PackageB,
        F: PackageF,
    };
    useEffect(() => {
        fetchServices()
    }, [])
    return (
        <MobileContainer>
            <div className="min-h-screen bg-white">
                <Header onLogout={onLogout} onViewBookingHistory={onViewBookingHistory} onBack={onBack} onLogin={onLogin} onViewLocation={onViewLocation} />
                <div className="flex flex-col h-full w-full max-w-[420px] mx-auto">
                    <StepProgress/>

                    {/* Main Content */}
                    <div className="flex-1 overflow-auto">
                        <div className="p-4">
                            <div className="flex items-center mb-4">
                                <h2 className="text-lg font-semibold">I'm Looking For...</h2>
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
                                    
                                        {/* <label key={'A'} className="flex items-center space-x-2">
                                            <input type="radio" name="servicePackage" value={packageType} className="form-radio text-blue-600"  defaultChecked={packageType == 'A'}/>
                                            <strong>Package A</strong>
                                        </label>
                                        <img src={PackageA} className='mx-auto'/> */} 
                                        <div className="relative">
                                            {/* <h3 className="text-[18px] text-gray-800 mb-2">Select Package</h3> */}
                                            <select
                                                value={packageType}
                                                onChange={(e) => setPackageType(e.target.value)}
                                                className="block appearance-none w-full px-3 py-2 cursor-pointer bg-white border border-gray-300 text-[16px] text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Package</option>
                                                <option value="A">Package A</option>
                                                <option value="B">Package B</option>
                                                <option value="F">Package F</option>
                                            </select>
                                            <div className="pointer-events-none absolute top-[75%] right-3 transform -translate-y-1/2 text-gray-600">
                                                <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M7 7l3 3 3-3" />
                                                </svg>
                                            </div>
                                        </div>
                                        {packageType && (
                                        <div className="text-center">
                                            <img src={packageImages[packageType]} alt={`Package ${packageType}`} className="mx-auto max-w-full" />
                                        </div>
                                        )}
                                </div>
                            </div>

                            {/* Specific Services */}
                            <div className="mb-6">
                                <h3 className="text-[18px] text-gray-800 mb-2">Other Services</h3>
                                <p className="text-[15px] text-gray-500 mb-4">You can select more than one</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {services && services.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => handleServiceToggle(service.name)}
                                            className={`p-3 text-[16px] text-gray-800 border text-left ${selectedServices.includes(service.name)
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
                                <h3 className="text-[18px] text-gray-800 mb-1">Remarks <span className="text-gray-500">(Optional)</span></h3>
                                <p className="text-[15px] text-gray-500 mb-2">Is there anything specific that you would like to get fixed? e.g. timing belt issues, alignment issues, etc.</p>
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