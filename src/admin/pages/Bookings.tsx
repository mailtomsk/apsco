import React, { useEffect, useState } from 'react';
import { getAllBookings } from '../../services/adminService';
import Pagination from '../components/Pagination';
import adminClient from "../../services/adminClient";
// import { toast } from 'react-toastify';
const perPage = import.meta.env.VITE_PAGINATION


interface Booking {
    id: string;
    reference_no: string;
    bookingDate: string;
    bookingTime: string;
    customerName: string;
    customerMobile: string;
    serviceCenterName: string;
    serviceCenterState: string;
    serviceCenterArea: string;
    vehicleDetails: {
        model: string;
        plateNumber: string;
    };
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    serviceType: 'Regular Maintenance' | 'Repair' | 'Inspection' | 'Body Work';
    notes?: string;
    packageType?:string;
}
interface Services {
    name: string
}
// interface Area {
//     name: string
// }
const Bookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Services[]>([]);
    // const [area, setArea] = useState<Area[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
    const [serviceCenterFilter, setServiceCenterFilter] = useState('all');
    const [areaFilter, setAreaFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // const [selected, setSelected] = useState('');
    const options = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    const [activeTab, setActiveTab] = useState<'Pending' | 'Completed'>('Pending');
    const tabStyle = (tab: string) =>
        `px-4 py-2 text-md font-medium transition rounded-[unset] w-[40%] ${activeTab === tab
            ? 'text-indigo-600  border-b border-indigo-600'
            : 'hover:text-indigo-600 '
        }`;
    
   // Get unique service centers for filter
    const serviceCenters = Array.from(new Set(bookings.map(booking => booking.serviceCenterName)));
    const serviceCentersAreas = React.useMemo(() => {
        return Array.from(new Set(bookings.map(booking => booking.serviceCenterArea)));
    }, [bookings]);

    // Filter bookings based on all criteria
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.reference_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.vehicleDetails.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !dateFilter || booking.bookingDate.includes(dateFilter);
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        const matchesServiceType = serviceTypeFilter === 'all' || booking.serviceType === serviceTypeFilter;
        const matchesServiceCenter = serviceCenterFilter === 'all' || booking.serviceCenterName === serviceCenterFilter;
        const matchesArea = areaFilter === 'all' || booking.serviceCenterArea === areaFilter;    

        return matchesSearch && matchesDate && matchesStatus && matchesServiceType && matchesServiceCenter && matchesArea;
    });
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

    // const visiblePages = 3;
    // const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    // const endPage = Math.min(totalPages, startPage + visiblePages - 1);
    const fetchServices = async () => {
        await adminClient.get('/v1/services').then((response) => {
            const { success, data } = response.data;
            if (success) {
                setServices(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }
    // const fetchAreas = async () => {
    //     await adminClient.get('/v1/areas').then((response) => {
    //         const { success, data } = response.data;
    //         if (success) {
    //             setArea(data);
    //         }
    //     }).catch((error: any) => {
    //         console.error(error);
    //     })
    // }
    const getBooking = async (activeTab: string) => {
        await getAllBookings(activeTab).then((response) => {
            const {success, data} = response;
            if (success){
                setBookings(data);
            }
        }, (error: any) => {
            console.error(error);
        })
    }
    // const updateStatus = async (id: string, value: string) => {       
    //     if (confirm('Do you want update the status?')) {
    //         await adminClient.post(`/v1/bookings/status-update`, { id: parseInt(id), status: value }).then((response) => {
    //             const { success, message } = response.data;
    //             if (success) {
    //                 getBooking(activeTab)
    //                 toast.success(message)
    //             }
    //         }).catch((error: any) => {
    //             toast.error(error.message);
    //         })
    //     }
    // }
    useEffect(() => {
        getBooking(activeTab);
        fetchServices();
    }, [activeTab, serviceTypeFilter, serviceCenterFilter, areaFilter]);

    // const getStatusBadgeClass = (status: string) => {
    //     switch (status) {
    //         case 'Completed':
    //             return 'bg-green-100 text-green-800';
    //         case 'Pending':
    //             return 'bg-yellow-100 text-yellow-800';
    //         case 'Confirmed':
    //             return 'bg-blue-100 text-blue-800';
    //         case 'Cancelled':
    //             return 'bg-red-100 text-red-800';
    //         default:
    //             return 'bg-gray-100 text-gray-800';
    //     }
    // };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Bookings</h1>

                {/* Filters Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        {/* Search Bar */}
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by Booking ID, Customer Name, or Plate Number"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Date Filter */}
                        <div>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                {options.map((val) => (
                                    <option key={val} value={val} >{val}</option>
                                ))}
                            </select>
                        </div>

                        {/* Service Type Filter */}
                        <div>
                            <select
                                value={serviceTypeFilter}
                                onChange={(e) => setServiceTypeFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Service Types</option>
                                {services && services.map((val, index) => (
                                    <option key={index} value={val.name} title={val.name}>{val.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Service Center Filter */}
                        <div>
                            <select
                                value={serviceCenterFilter}
                                onChange={(e) => setServiceCenterFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Service Centers</option>
                                {serviceCenters.map(center => (
                                    <option key={center} value={center}>{center}</option>
                                ))}
                            </select>
                        </div>

                        {/* Service Type Filter */}
                        <div>
                            <select
                                value={areaFilter}
                                onChange={(e) => setAreaFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Area</option>
                                {serviceCentersAreas && serviceCentersAreas.map(val => (
                                    <option key={val} value={val}>{val}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Filter Stats */}
                    <div className="mt-4 flex justify-between items-center">
                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredBookings.length} of {bookings.length} bookings
                            {statusFilter !== 'all' && ` • ${statusFilter}`}
                            {serviceTypeFilter !== 'all' && ` • ${serviceTypeFilter}`}
                            {serviceCenterFilter !== 'all' && ` • ${serviceCenterFilter}`}
                            
                        </div>
                        {/* <button
                            onClick={() => {
                                setSearchTerm('');
                                setDateFilter('');
                                setStatusFilter('');
                                setServiceTypeFilter('');
                                setServiceCenterFilter('');
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                        >
                            Clear Filters
                        </button> */}
                    </div>
                </div>
            </div>

            <div className="flex justify-around gap-[15px] mb-[15px]">
                <button onClick={() => setActiveTab('Pending')} className={tabStyle('Pending')}>
                    Pending
                </button>
                <button onClick={() => setActiveTab('Completed')} className={tabStyle('Completed')}>
                    Completed
                </button>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                            <tr>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Booking Details
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Customer & Vehicle
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Service Center
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Service Type
                                </th>
                                  <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Package Type
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((booking) => (
                                    <tr key={booking.reference_no}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">#{booking.reference_no}</div>
                                            <div className="text-sm text-gray-500">
                                                {booking.bookingDate} at {booking.bookingTime}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                                            <div className="text-sm text-gray-500">
                                                {booking.customerMobile}<br/>
                                                {booking.vehicleDetails.model} - {booking.vehicleDetails.plateNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.serviceCenterName}</div>
                                            <div className="text-sm text-gray-500">
                                                {booking.serviceCenterState} - {booking.serviceCenterArea}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{booking.serviceType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm text-gray-900">{booking.packageType}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">    
                                            {/* <select
                                                value={booking.status}
                                                onChange={(e) => updateStatus(booking.id, e.target.value)}
                                                disabled={booking.status === 'Completed'}
                                                className={`w-full px-3 py-2 border rounded-lg text-sm shadow-sm 
                                                ${booking.status === 'Pending' ? 'bg-yellow-100 border-yellow-300' :
                                                booking.status === 'Confirmed' ? 'bg-green-100 border-green-300' :
                                                booking.status === 'Cancelled' ? 'bg-red-100 border-red-300' :
                                                booking.status === 'Completed' ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300'}
                                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                                ${booking.status === 'Completed' ? 'opacity-60 pointer-events-none' : ''} `}
                                            >
                                                <option value="all" className="text-gray-700">All Status</option>
                                                {options.map((val) => (
                                                    <option key={val} value={val} className="text-gray-700">
                                                        {val}
                                                    </option>
                                                ))}
                                            </select> */}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs
                                            ${booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500' : 
                                            booking.status === 'Completed' ? 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500 ' :
                                            booking.status === 'Cancelled' ? 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500 ' : ''} `}>
                                            {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{booking.notes}</div>
                                        </td>
                                    </tr>
                                ))
                            ): (
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap" colSpan={6} align='center'>Data not found</td>
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

export default Bookings; 