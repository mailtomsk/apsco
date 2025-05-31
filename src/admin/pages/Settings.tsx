import React from 'react';

const Settings: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="TISCO"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="contact@tisco.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">Email Notifications</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">SMS Notifications</label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings; 