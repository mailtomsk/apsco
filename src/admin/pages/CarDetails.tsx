import React from 'react';
import CarBrands from '../components/CarBrands';
import CarModels from '../components/CarModel';

const CarDetails: React.FC = () => {
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Car Details </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <CarBrands/>
                    </div>


                    <div className="bg-white rounded-lg shadow p-6">
                        <CarModels/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CarDetails;