import React from 'react';
import { ServiceCenter } from '../data/serviceData';

interface ServiceCardProps {
  center: ServiceCenter;
  selected: boolean;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ center, selected, onClick }) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 mb-4 cursor-pointer transition-all
        ${selected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg mb-2">{center.name}</h3>
      <p className="text-gray-600 text-sm">
        {center.address}
      </p>
      <p className="text-gray-600 text-sm">
        {center.city}, {center.state} {center.postcode}
      </p>
    </div>
  );
};

export default ServiceCard;