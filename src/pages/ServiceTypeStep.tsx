import React, { useState } from 'react';
import { specificServices, servicePackages } from '../data/serviceData';
import { Wrench, ChevronRight, X, Check, ArrowLeft } from 'lucide-react';

interface ServiceTypeStepProps {
  onNext: (serviceType: string[]) => void;
  onBack: () => void;
}

const ServiceTypeStep: React.FC<ServiceTypeStepProps> = ({ onNext, onBack }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [showPackages, setShowPackages] = useState(false);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      onNext(selectedServices);
    }
  };

  const ServicePackageModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">Select Service Package</h3>
          <button 
            onClick={() => setShowPackages(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {servicePackages.map((pkg) => (
            <div
              key={pkg.id}
              className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => {
                setSelectedServices([pkg.id]);
                setShowPackages(false);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{pkg.name}</h4>
                <div className="text-right">
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-xl font-bold text-blue-600">
                    RM {pkg.price.toFixed(2)}*
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
              <div className="space-y-2">
                {pkg.description.split(', ').map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Estimated time: {pkg.estimatedTime}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <p className="text-xs text-gray-500 text-center mb-4">
            *Prices shown are NOT inclusive of SST.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <h2 className="text-xl font-bold ml-4">I'm Looking For...</h2>
      </div>

      <div className="mb-6">
        <div
          className="bg-blue-50 p-4 rounded-lg flex items-center justify-between cursor-pointer mb-6"
          onClick={() => setShowPackages(true)}
        >
          <div className="flex items-center space-x-3">
            <Wrench className="w-5 h-5 text-blue-500" />
            <span className="text-blue-600">Choose from Our Service Packages</span>
          </div>
          <ChevronRight className="w-5 h-5 text-blue-500" />
        </div>

        <h3 className="font-semibold mb-2">Specific Services</h3>
        <p className="text-sm text-gray-600 mb-4">You can select more than one</p>

        <div className="grid grid-cols-2 gap-3">
          {specificServices.map((service) => (
            <button
              key={service.id}
              className={`p-3 rounded-lg border text-left transition-all
                ${selectedServices.includes(service.id)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-300 text-gray-700'}`}
              onClick={() => toggleService(service.id)}
            >
              {service.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Remarks <span className="text-gray-500">(Optional)</span></h3>
        <p className="text-sm text-gray-600 mb-2">
          Is there anything specific that you would like to get fixed? e.g. timing
          belt issues, alignment issues, etc.
        </p>
        <textarea
          className="w-full p-3 border rounded-lg min-h-[120px] resize-none"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter your remarks here..."
        />
      </div>

      <button
        className={`w-full py-3 rounded-lg text-white font-medium
          ${selectedServices.length > 0
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-300 cursor-not-allowed'}`}
        onClick={handleContinue}
        disabled={selectedServices.length === 0}
      >
        Continue
      </button>

      {showPackages && <ServicePackageModal />}
    </div>
  );
};

export default ServiceTypeStep;