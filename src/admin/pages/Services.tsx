import React, { useState, useEffect } from 'react';
import { Service } from '../../utils/helpers';
import adminClient from "../../services/adminClient";
import { toast } from "react-toastify";
import { getAllServices, serviceStatusUpdate } from '../../services/adminService';
import Pagination from '../components/Pagination';
import { useSidebar } from "../context/SidebarContext";
const perPage = import.meta.env.VITE_PAGINATION

const Services: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setselectedService] = useState<Service | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newService, setNewService] = useState<Partial<Service>>({
        id: '',
        name: '',
        description: '',
        status: true
    });
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        status: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // getAllCenter
    const fetchServices = async () => {
        await getAllServices().then((response) => {
            const { success, data } = response;
            if (success) {
                setServices(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }

    // Filter service centers based on all criteria
    const filteredservices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const statusActiveInActive: boolean = filterStatus == '1' ? true : false; 
        const matchesStatus = filterStatus === 'all' || service.status === statusActiveInActive;
        return matchesSearch && matchesStatus;
    });
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(filteredservices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredservices.slice(indexOfFirstItem, indexOfLastItem);

    const visiblePages = 3;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);
    // Form Validation
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            description: '',
            status: ''
        };
        if (!newService.name?.trim()) {
            newErrors.name = 'Service name is required';
            isValid = false;
        }
        if (!newService.description?.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = {
                name: newService.name,
                description: newService.description,
                status: newService.status ? true : false,
            }
            adminClient.post(`/v1/services/create`, formData).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    setShowForm(false);
                    resetForm();
                    fetchServices();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    };

    const handleEditService = (service: Service) => {
        setselectedService(service);
        setNewService(service);
        setShowForm(true);
    };

    const handleUpdateService = async (e: React.FormEvent) => {
        if (!selectedService) return;
        e.preventDefault();
        if (validateForm()) {
            if (confirm('Do you want update the service?')) {
                const formData = {
                    name: newService.name,
                    description: newService.description,
                    status: newService.status ? true : false,
                }
                adminClient.post(`/v1/services/${newService.id}/update`, formData).then((response) => {
                    const { success, message } = response.data;
                    if (success) {
                        toast.success(message);
                        setShowForm(false);
                        resetForm();
                        fetchServices();
                    }
                }).catch((error) => {
                    toast.error(error.message)
                })
            }
        }
        setShowForm(false);
        setselectedService(null);
        resetForm();
    };

    const handleDeleteCenter = (id: string) => {
        if (confirm('Do you want update the service?')) {
            adminClient.get(`/v1/services/${id}/delete`).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    fetchServices();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    };

    const handleStatusToggle = async(serviceId: string, status: boolean) => {
        if (confirm('Do you want update the status?')) {
            console.log(status);
            
            let updateStatus = !status ? true : false;
            await serviceStatusUpdate({service_id:serviceId, status:updateStatus}).then((response) => {
                const {success} = response;
                if (success) {
                    fetchServices()
                }
            },(error) => {
                toast.error(error.message);
            });
        }
    }

    const resetForm = () => {
        setNewService({
            name: '',
            description: '',
            status: true
        });
        setErrors({
            name: '',
            description: '',
            status: ''
        });
    };
    useEffect(() => {
        fetchServices();
    }, []);

    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Services</h1>
                    <button
                        onClick={() => {
                            setselectedService(null);
                            resetForm();
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Add New Service
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search Bar */}
                        <div className="lg:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by name, address, or area..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Status Filter */}
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        {/* Rating Filter */}
                    </div>

                    {/* Filter Stats */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredservices.length} of {services.length} service centers
                        {filterStatus !== 'all' && ` • ${filterStatus}`}
                    </div>
                </div>
            </div>

            {/* Service Centers List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((service) => (
                                    <tr key={service.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{service.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusToggle(service.id, service.status)}
                                                className={`mr-2 px-3 py-1 rounded-md ${service.status
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                    }`}
                                            >
                                                {service.status ? 'Activate' : 'Deactivate'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEditService(service)}
                                                className="text-blue-600 hover:text-blue-900 mr-2"
                                            >
                                                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.9888 4.28491L19.6405 2.93089C18.4045 1.6897 16.4944 1.6897 15.2584 2.93089L13.0112 5.30042L18.7416 11.055L21.1011 8.68547C21.6629 8.1213 22 7.33145 22 6.54161C22 5.75176 21.5506 4.84908 20.9888 4.28491Z" fill="#030D45"/>
                                                        <path d="M16.2697 10.9422L11.7753 6.42877L2.89888 15.3427C2.33708 15.9069 2 16.6968 2 17.5994V21.0973C2 21.5487 2.33708 22 2.89888 22H6.49438C7.2809 22 8.06742 21.6615 8.74157 21.0973L17.618 12.1834L16.2697 10.9422Z" fill="#030D45"/>
                                                    </svg> 
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCenter(service.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 5a1 1 0 112 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V7z" clip-rule="evenodd"/>
                                                    </svg>
                                                </span> 
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ): (
                                <tr>
                                    <td colSpan={4} align='center' className="px-6 py-4 whitespace-nowrap">Data not found</td>
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

            {/* Add/Edit Form Modal */}
            {showForm && ( 
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${
                        !isExpanded && !isHovered ? '' : 'lg:pl-[290px]'
                    }`}
                > 
                    <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                {selectedService ? 'Edit Service' : 'Add New Service'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setselectedService(null);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter service name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    value={newService.description}
                                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter description"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <div className="mt-2">
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="active"
                                                checked={newService.status}
                                                onChange={(e) => setNewService({ ...newService, status: e.target.value as unknown as true | false })}
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="inactive"
                                                checked={!newService.status}
                                                onChange={(e) => setNewService({ ...newService, status: e.target.value as unknown as true | false })}
                                            />
                                            <span className="ml-2">Inactive</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setselectedService(null);
                                    resetForm();
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedService ? handleUpdateService : handleAddService}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {selectedService ? 'Update Service' : 'Add Service'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services; 