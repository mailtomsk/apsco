import React, { useState, useEffect } from 'react';
import State from '../components/State';
import Area from '../components/Area';


const StateAndArea: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage State and Area</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <State/>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <Area/>
                </div>
            </div>
        </div>
    )
}

export default StateAndArea;