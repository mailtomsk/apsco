import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center w-full mb-8 relative">
      <div className="absolute left-0 right-0 top-4 h-[2px] bg-gray-300" />
      {steps.map((step, index) => (
        <div 
          key={step} 
          className={`flex-1 flex flex-col items-center relative
            ${index === 0 ? 'pl-0' : ''} 
            ${index === steps.length - 1 ? 'pr-0' : ''}`}
        >
          <div 
            className={`z-10 flex items-center justify-center w-8 h-8 rounded-full border-2
              ${index < currentStep 
                ? 'border-green-500 bg-green-500 text-white' 
                : index === currentStep 
                  ? 'border-blue-500 bg-white text-blue-500' 
                  : 'border-gray-300 bg-white text-gray-300'}`}
          >
            <span className="text-sm font-medium">{index + 1}</span>
          </div>
          <span 
            className={`text-xs mt-2 text-center max-w-[80px]
              ${index === currentStep ? 'text-blue-500 font-medium' : 'text-gray-500'}`}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div 
              className={`absolute top-4 left-1/2 right-0 h-[2px] transition-colors
                ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;