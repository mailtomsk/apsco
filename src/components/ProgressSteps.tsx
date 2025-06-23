import React from 'react';

interface ProgressStepsProps {
    currentStep: number;
}
const steps = [
    { label: 'Location' },
    { label: 'Appointment' },
    { label: 'Car Details' },
    { label: 'Service Type' },
    { label: 'Summary' },
];
const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
    return (
        <>
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
                    {/* <span className="text-green-500">Location</span>
                    <span className="text-blue-500">Appointment</span>
                    <span className="text-gray-500">Car Details</span>
                    <span className="text-gray-500">Service Type</span>
                    <span className="text-gray-500">Summary</span> */}
                    {steps.map((step, index) => (
                        <span
                            key={index}
                            className={`${index + 1 < currentStep
                                    ? 'text-green-500'
                                    : index + 1 === currentStep
                                        ? 'text-blue-500'
                                        : 'text-gray-500'
                                }`}
                        >
                            {step.label}
                        </span>
                    ))}
                </div>
            </div>
        </>
    )
}

export default ProgressSteps; 