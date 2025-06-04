import React, { useEffect, useState } from 'react';
import { getCustomers, customerDelete } from '../../services/adminService';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import adminClient from "../../services/adminClient";
import DeleteIcon from "../../assets/icons/delete";
const perPage = import.meta.env.VITE_PAGINATION

interface Customer {
    sno:string;
    id: string;
    name: string;
    email: string;
    phone: string;
    is_verified: boolean;
    vehicles: {
        model: string;
        plateNumber: string;
        year: string;
    }[];
    totalBookings: number;
    lastBooking: string;
    joinDate: string;
}

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [phoneFilter, setPhoneFilter] = useState('');
    const [plateFilter, setPlateFilter] = useState('');
    const [showDetails, setShowDetails] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    const filteredCustomers = customers.filter(customer => {
        const matchesName = customer.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesEmail = customer.email.toLowerCase().includes(emailFilter.toLowerCase());
        const matchesPhone = customer.phone.toLowerCase().includes(phoneFilter.toLowerCase());
        const matchesPlate = customer.vehicles.some(vehicle =>
            vehicle.plateNumber.toLowerCase().includes(plateFilter.toLowerCase())
        );

        return matchesName && matchesEmail && matchesPhone && (plateFilter === '' || matchesPlate);
    });
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    const visiblePages = 3;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const handleDeleteCustomer = async(customerId: string) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            await adminClient.get(`/v1/customers/${customerId}/delete`).then((response) => {
                const {success, data, message} = response.data;
                if (success) {
                    setCustomers(data);
                    toast.success(message);
                }
            }).catch((error) => {
                toast.error(error.message);
            });
            //setCustomers(customers.filter(customer => customer.id !== customerId));
        }
    };

    const getAllCustomers = async() => {
        await getCustomers().then((response) => {
            const {success, data} = response;
            if (success) {
                setCustomers(data);
            }
        }, (error) => {
            console.log(error);
        });
    }
    const handleVerified = async (id: any, verified: boolean) => {
        if (verified) {
            toast.warning('Already verified this account.')
            return false
        };
        if (window.confirm('Are you sure you want to verified this customer?')) {
            await adminClient.get(`/v1/customers/${id}/account-verified`).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    getAllCustomers();
                    toast.success(message);
                }
            }).catch((error) => {
                toast.error(error.message);
            });
        }
    }
    useEffect(() => {
        getAllCustomers();
    }, [])

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Customers</h1>

                {/* Search Filters Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Name Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Email Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Phone Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Search by phone..."
                                value={phoneFilter}
                                onChange={(e) => setPhoneFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Plate Number Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Plate</label>
                            <input
                                type="text"
                                placeholder="Search by plate number..."
                                value={plateFilter}
                                onChange={(e) => setPlateFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Showing {filteredCustomers.length} of {customers.length} customers
                        </div>
                        <button
                            onClick={() => {
                                setNameFilter('');
                                setEmailFilter('');
                                setPhoneFilter('');
                                setPlateFilter('');
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                            <tr>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Customer Details
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Contact Information
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Vehicles
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Booking History
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Account Verified
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((customer) => (
                                    <React.Fragment key={customer.id}>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{customer.sno}</div>
                                                <div className="text-sm text-gray-500">{customer.name}</div>
                                                <div className="text-xs text-gray-400">Joined: {customer.joinDate}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.email}</div>
                                                <div className="text-sm text-gray-500">{customer.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {customer.vehicles.map((vehicle, index) => {
                                                        const isLast = index === customer.vehicles.length - 1;
                                                        return (
                                                            <div
                                                                key={vehicle.plateNumber}
                                                                className={`${index > 0 ? 'mt-2' : ''} ${isLast ? 'block' : 'hidden'}`}
                                                            >
                                                                {vehicle.model} ({vehicle.year})
                                                                <div className="text-xs text-gray-500">{vehicle.plateNumber}</div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    Total Bookings: {customer.totalBookings}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Last Booking: {customer.lastBooking}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleVerified(customer.id, customer.is_verified)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs ${customer.is_verified
                                                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                        }`}>
                                                    {customer.is_verified ? 'Verified' : 'Unverified'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setShowDetails(showDetails === customer.id ? null : customer.id)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    {showDetails === customer.id ? 
                                                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 6c-4.59 0-8.44 2.91-10 6 1.06 2.08 2.92 3.81 5.17 4.82L4.21 20.78a1 1 0 001.42 1.42l15-15a1 1 0 10-1.42-1.42L15.3 7.34A9.79 9.79 0 0012 6zm0 2c.82 0 1.58.2 2.26.55l-1.7 1.7a2 2 0 00-2.58 2.58l-1.7 1.7A5.93 5.93 0 0112 8zm0 10c4.59 0 8.44-2.91 10-6-.91-1.78-2.32-3.27-4.02-4.34l-1.45 1.45A5.93 5.93 0 0112 16a5.9 5.9 0 01-2.27-.46l-1.42 1.42C9.55 17.83 10.76 18 12 18z"/>
                                                            </svg>
                                                        </span>
                                                    : 
                                                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 5C7.454 5 3.732 8.11 2 12c1.732 3.89 5.454 7 10 7s8.268-3.11 10-7c-1.732-3.89-5.454-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z"/>
                                                            </svg>
                                                        </span>
                                                    }
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                        <DeleteIcon/>
                                                    </span> 
                                                </button>
                                            </td>
                                        </tr>
                                        {showDetails === customer.id && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 bg-gray-50">
                                                    <div className="text-sm">
                                                        <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-gray-600">Customer ID: {customer.id}</p>
                                                                <p className="text-gray-600">Join Date: {customer.joinDate}</p>
                                                                <p className="text-gray-600">Total Bookings: {customer.totalBookings}</p>
                                                                <p className="text-gray-600">Last Booking: {customer.lastBooking}</p>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">Registered Vehicles:</p>
                                                                {customer.vehicles.map((vehicle) => (
                                                                    <div key={vehicle.plateNumber} className="mt-1">
                                                                        <p className="text-gray-600">
                                                                            {vehicle.model} ({vehicle.year}) - {vehicle.plateNumber}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ): (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap" align='center'>Data not found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            visiblePages={3}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers; 