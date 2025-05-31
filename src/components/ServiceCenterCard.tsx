import React, { useState } from 'react';
import { ServiceCenter } from '../data/serviceCenters';
import { Clock, Star, ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceCenterCardProps {
  center: ServiceCenter;
  onClick: () => void;
}

const ServiceCenterCard: React.FC<ServiceCenterCardProps> = ({ center, onClick }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= score
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {score.toFixed(1)} ({center.total_reviews} reviews)
        </span>
      </div>
    );
  };

  return (
    <div
      className="border rounded-lg overflow-hidden hover:border-blue-500 active:bg-blue-50 cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={center.thumbnail}
          alt={center.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
        <p className="mt-1 text-sm text-gray-600">{center.address}</p>

        {/* Rating */}
        <div className="mt-2">
          {renderStars(center.rating)}
        </div>

        {/* Amenities */}
        {/* <div className="mt-3 flex flex-wrap gap-2">
          {center.amenities.map((amenity, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div> */}

        {/* Expand/Collapse Button */}
        <button
          className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-500"
          onClick={handleExpandClick}
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show working hours
            </>
          )}
        </button>

        {/* Working Hours */}
        {showDetails && (
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-medium">Working Hours</span>
            </div>
            <div className="ml-6 space-y-1">
              <p>
                <span className="font-medium">Weekdays:</span> {center.working_weekdays}
              </p>
              <p>
                <span className="font-medium">Saturday:</span> {center.working_saturday}
              </p>
              <p>
                <span className="font-medium">Sunday:</span> {center.working_sunday}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCenterCard; 