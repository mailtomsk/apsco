import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setStep } from '../auth/bookingSlice';

const StepProgress: React.FC = () => {
const dispatch = useAppDispatch();

const stepKeys = ['location', 'appointment', 'car-details', 'service-type', 'summary'];
const stepLabels = ['Location', 'Appointment', 'Car Details', 'Service Type', 'Summary'];

// 🔥 Dynamically get the current step from Redux
//const currentStepKey = useAppSelector((state) => state.booking.step);
//const currentStep = 1; // -1 if not matched

const currentStepKey = useAppSelector((state) => state.auth.booking.step);

const currentStep = (() => {
  switch (currentStepKey) {
    case 'location':
    case 'appointment':
      return 1;
    case 'car-details':
      return 2;
    case 'service-type':
      return 3;
    case 'summary':
      return 4;
    default:
      return 0; // fallback or login step
  }
})();

const handleStepClick = (index: number) => {
  console.log(stepKeys[index]);
  if (index <= currentStep) {
    dispatch(setStep(stepKeys[index]));
  }
};

return (
    <div className="px-4 py-4 bg-white">
      {/* Step Circles */}
        <div className="flex items-center justify-between">
            {stepLabels.map((label, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            console.log(isCurrent+' == '+currentStep);

            const circleClasses = [
                'w-7 h-7 rounded-full flex items-center justify-center text-sm',
                isCompleted
                ? 'bg-green-500 text-white cursor-pointer'
                : isCurrent
                ? 'bg-blue-500 text-white cursor-pointer'
                : 'bg-gray-300 text-white cursor-not-allowed',
            ].join(' ');

            const lineClasses = index < currentStep ? 'bg-green-500' : 'bg-gray-300';

            const outerWrapperClass = [
                'flex-1 flex items-center',
                index === 0 ? 'ml-2' : '',
            ].join(' ');

            if (index < stepLabels.length - 1) {
                return (
                <div key={index} className={outerWrapperClass}>
                    <div
                    className={circleClasses}
                    onClick={index <= currentStep ? () => handleStepClick(index) : () => void 0}
                    >
                    {index + 1}
                    </div>
                    <div className={`flex-1 h-0.5 ${lineClasses}`} />
                </div>
                );
            } else {
                return (
                <div
                    key={index}
                    className={`${circleClasses} mr-2`}
                    onClick={index <= currentStep ? () => handleStepClick(index) : () => void 0}
                >
                    {index + 1}
                </div>
                );
            }
            })}
        </div>

        {/* Step Labels */}
        <div className="mt-2 flex justify-between text-xs">
            {stepLabels.map((label, index) => (
            <span
                key={index}
                className={`${
                index < currentStep
                    ? 'text-green-500'
                    : index === currentStep
                    ? 'text-blue-500 font-medium'
                    : 'text-gray-400'
                }`}
            >
                {label}
            </span>
            ))}
        </div>
    </div>
  );
};

export default StepProgress;
