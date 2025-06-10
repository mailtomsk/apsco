import React, { useState, useEffect } from 'react';
import { Service } from '../../utils/helpers';
import adminClient from "../../services/adminClient";
import { toast } from "react-toastify";
import { getAllServices, serviceStatusUpdate } from '../../services/adminService';
import Pagination from '../components/Pagination';
import { useSidebar } from "../context/SidebarContext";
import EditIcon from "../../assets/icons/edit";
import DeleteIcon from "../../assets/icons/delete";
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
        if (confirm('Are you sure you want to delete?')) {
            adminClient.get(`/v1/services/${id}/delete`).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    fetchServices();
                    setCurrentPage(1);
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
                        className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-white px-2 py-2 text-sm text-brand-600 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 hover:text-white border border-brand-600"
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
                                placeholder="Search by name"
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
                        <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                            <tr>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Service Name
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Description
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Status
                                </th>
                                <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentItems.length > 0 ? (
                                currentItems.map((service) => (
                                    <tr key={service.id}>
                                        <td className="px-1 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-1 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{service.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusToggle(service.id, service.status)}
                                                className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs ${service.status
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                    }`}
                                            >
                                                {service.status ? 'Activate' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEditService(service)}
                                                className="text-blue-600 hover:text-blue-900 mr-2"
                                            >
                                                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                    <EditIcon/>
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCenter(service.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                    <DeleteIcon />
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
                    <div className="relative top-20 mx-auto p-5 border w-1/2 md:w-1/4 shadow-lg rounded-md bg-white">
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
                        <div className="grid-cols-1 gap-4">
                            <div className='mb-[10px] mt-[10px]'>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    maxLength={50}
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter service name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div className='mb-[10px] mt-[10px]'>
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
                                                checked={newService.status === true}
                                                onChange={(e) => setNewService({ ...newService, status: true })}
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="inactive"
                                                checked={newService.status === false}
                                                onChange={(e) => setNewService({ ...newService, status: false })}
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
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-2 py-2 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedService ? handleUpdateService : handleAddService}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-2 py-2 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
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