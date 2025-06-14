import React, { useState, useEffect } from 'react';
import { ServiceCenter } from '../../data/serviceCenters';
import { State, Area } from '../../data/malaysiaLocations';
import adminClient from "../../services/adminClient";
import { toast } from "react-toastify";
import { getAllStateCity, getAllServiceCenter } from '../../services/adminService';
import Pagination from '../components/Pagination';
import { useSidebar } from "../context/SidebarContext";
const perPage = import.meta.env.VITE_PAGINATION

const ServiceCenters: React.FC = () => {
    const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
    const [selectedCenter, setSelectedCenter] = useState<ServiceCenter | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedState, setSelectedState] = useState('');
    const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
    const [newCenter, setNewCenter] = useState<Partial<ServiceCenter>>({
        id: '',
        name: '',
        address: '',
        thumbnail: '',
        rating: 0,
        total_reviews: 0,
        working_weekdays: '',
        working_saturday: '',
        working_sunday: '',
        state: '',
        area: '',
        status: 'active'
    });
    const [errors, setErrors] = useState({
        name: '',
        address: '',
        thumbnail: '',
        rating: 0,
        total_reviews: 0,
        working_weekdays: '',
        working_saturday: '',
        working_sunday: '',
        state: '',
        area: '',
        status: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterState, setFilterState] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const [states, setStates] = useState<State[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination

    // getAllCenter
    const fetchCenter = async () => {
        await getAllServiceCenter().then((response) => {
            const { success, data } = response;
            if (success) {
                setServiceCenters(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }

    // getLocation
    const fetchLocation = async () => {
        await getAllStateCity().then((response) => {
            const { success,  data:{allState, allCity}} = response;
            if (success) {
                setStates(allState);
                setAreas(allCity);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }

    // Filter service centers based on all criteria
    const filteredServiceCenters = serviceCenters.filter(center => {
        const matchesSearch =
            center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.area.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesState = !filterState || center.state === filterState;
        const matchesStatus = filterStatus === 'all' || center.status === filterStatus;
        const matchesRating = filterRating === 'all' ||
            (filterRating === '4.5+' && center.rating >= 4.5) ||
            (filterRating === '4.0+' && center.rating >= 4.0) ||
            (filterRating === '3.5+' && center.rating >= 3.5);

        return matchesSearch && matchesState && matchesStatus && matchesRating;
    });
    
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(filteredServiceCenters.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredServiceCenters.slice(indexOfFirstItem, indexOfLastItem);

    const visiblePages = 3;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Form Validation
    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            address: '',
            thumbnail: '',
            rating: 0,
            total_reviews: 0,
            working_weekdays: '',
            working_saturday: '',
            working_sunday: '',
            state: '',
            area: '',
            status: ''
        };
        // Full Name validation
        if (!newCenter.name?.trim()) {
            newErrors.name = 'Full name is required';
            isValid = false;
        }
        if (!newCenter.address?.trim()) {
            newErrors.address = 'Address is required';
            isValid = false;
        }
        if (!newCenter.state?.trim()) {
            newErrors.state = 'State is required';
            isValid = false;
        }
        if (!newCenter.area?.trim()) {
            newErrors.area = 'Area is required';
            isValid = false;
        }
        if (!newCenter.thumbnail?.trim()) {
            newErrors.thumbnail = 'Thumbnail image is required';
            isValid = false;
        }
        if (!newCenter.working_weekdays?.trim()) {
            newErrors.working_weekdays = 'Working Weekdays is required';
            isValid = false;
        }
        if (!newCenter.working_saturday?.trim()) {
            newErrors.working_saturday = 'Working Saturday is required';
            isValid = false;
        }
        if (!newCenter.working_sunday?.trim()) {
            newErrors.working_sunday = 'Working Sunday is required';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }

    const handleAddCenter = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('name', newCenter.name || '');
            formData.append('address', newCenter.address || '');
            formData.append('state', newCenter.state || '');
            formData.append('area', newCenter.area || '');
            formData.append('rating', (newCenter.rating || 0).toString());
            formData.append('total_reviews', (newCenter.total_reviews || 0).toString());
            formData.append('working_weekdays', newCenter.working_weekdays || '');
            formData.append('working_saturday', newCenter.working_saturday || '');
            formData.append('working_sunday', newCenter.working_sunday || '');
            formData.append('status', newCenter.status || 'active');
            if (selectedFile) {
                formData.append('thumbnail', selectedFile);
            } else {
                toast("No file selected for center thumbnail.");
            }
            adminClient.post(`/v1/service-center/create`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then((response) => {
                const {success, message} = response.data;
                if(success) {
                    toast.success(message);
                    setShowForm(false);
                    resetForm();
                    fetchCenter();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    };

    const handleEditCenter = (center: ServiceCenter) => {
        setSelectedCenter(center);
        setNewCenter(center);
        setShowForm(true);
        setSelectedState(center.state)
    };

    const handleUpdateCenter = async (e: React.FormEvent) => {
        if (!selectedCenter) return;
        e.preventDefault();
        if (validateForm()) {
            const formData = new FormData();
            formData.append('name', newCenter.name || '');
            formData.append('address', newCenter.address || '');
            formData.append('state', newCenter.state || '');
            formData.append('area', newCenter.area || '');
            formData.append('rating', (newCenter.rating || 0).toString());
            formData.append('total_reviews', (newCenter.total_reviews || 0).toString());
            formData.append('working_weekdays', newCenter.working_weekdays || '');
            formData.append('working_saturday', newCenter.working_saturday || '');
            formData.append('working_sunday', newCenter.working_sunday || '');
            formData.append('status', newCenter.status || 'active');
            if (selectedFile) {
                formData.append('thumbnail', selectedFile);
            } else {
                toast("No file selected for center thumbnail.");
            }
            adminClient.post(`/v1/service-center/${newCenter.id}/update`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    setShowForm(false);
                    resetForm();
                    fetchCenter();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
        setShowForm(false);
        setSelectedCenter(null);
        resetForm();
    };

    const handleDeleteCenter = (id: string) => {
        if (confirm('Do you want delete the service center?')) {
            adminClient.get(`/v1/service-center/${id}/delete`).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    fetchCenter();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCenter({ ...newCenter, thumbnail: reader.result as string });
            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        }
    };

    const handleStatusToggle = (centerId: string, status: string) => {
        if (confirm('Do you want update the status?')) {
            const current_status = status === 'active' ? false : true;
            const postData = {
                service_id: centerId,
                status: current_status,
            }
            adminClient.post('/v1/service-center/status-update', postData).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    fetchCenter();
                }
            }).catch((error) => {
                toast.error(error.message)
            });
        }
    };

    const getStatusBadgeClass = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const resetForm = () => {
        setNewCenter({
            name: '',
            address: '',
            state: '',
            area: '',
            thumbnail: '',
            rating: 0,
            total_reviews: 0,
            working_weekdays: '',
            working_saturday: '',
            working_sunday: '',
            status: 'active'
        });
        setErrors({
            name: '',
            address: '',
            thumbnail: '',
            rating: 0,
            total_reviews: 0,
            working_weekdays: '',
            working_saturday: '',
            working_sunday: '',
            state: '',
            area: '',
            status: ''
        });
        setSelectedState('')
    };

    useEffect(() => {
        fetchCenter();
        fetchLocation();
    }, [searchTerm, filterState, filterStatus, filterRating]);

    useEffect(() => {
        if (selectedState) {
            const stateAreas = areas.filter(area => area.state.name === selectedState).map(area => area.name);
            setFilteredAreas(stateAreas);
        } else {
            setFilteredAreas([]);
        }
    }, [selectedState, areas]);

    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Manage Service Centers</h1>
                    <button
                        onClick={() => {
                            setSelectedCenter(null);
                            resetForm();
                            setShowForm(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Add New Center
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

                        {/* State Filter */}
                        <div>
                            <select
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All States</option>
                                {states.map(state => (
                                    <option key={state.name} value={state.name}>{state.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <select
                                value={filterRating}
                                onChange={(e) => setFilterRating(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Ratings</option>
                                <option value="4.5+">4.5+ ★</option>
                                <option value="4.0+">4.0+ ★</option>
                                <option value="3.5+">3.5+ ★</option>
                            </select>
                        </div>
                    </div>

                    {/* Filter Stats */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredServiceCenters.length} of {serviceCenters.length} service centers
                        {filterState && ` in ${filterState}`}
                        {filterStatus !== 'all' && ` • ${filterStatus}`}
                        {filterRating !== 'all' && ` • Rating ${filterRating}`}
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
                                    Service Center
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
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
                                currentItems.map((center) => (
                                    <tr key={center.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={center.thumbnail}
                                                        alt={center.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{center.name}</div>
                                                    <div className="text-sm text-gray-500">{center.address}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{center.state}</div>
                                            <div className="text-sm text-gray-500">{center.area}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{center.rating} ★</div>
                                            <div className="text-sm text-gray-500">{center.total_reviews} reviews</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleStatusToggle(center.id, center.status)}
                                                className={`mr-2 px-3 py-1 rounded-md ${center.status === 'active'
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                    }`}
                                            >
                                                {center.status === 'active' ? 'Activate' : 'Deactivate'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEditCenter(center)}
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
                                                onClick={() => handleDeleteCenter(center.id)}
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
                            ) : (
                                <tr>
                                    <td colSpan = { 5 } align = 'center' className = "px-6 py-4 whitespace-nowrap">Data not found</td>
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
                                {selectedCenter ? 'Edit Service Center' : 'Add New Service Center'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setSelectedCenter(null);
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
                                    value={newCenter.name}
                                    onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter service center name"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    type="text"
                                    value={newCenter.address}
                                    onChange={(e) => setNewCenter({ ...newCenter, address: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter complete address"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">State</label>
                                <select
                                    value={selectedState}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        setNewCenter({ ...newCenter, state: e.target.value, area: '' });
                                    }}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.id} value={state.name}>{state.name}</option>
                                    ))}
                                </select>
                                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Area</label>
                                <select
                                    value={newCenter.area}
                                    onChange={(e) => setNewCenter({ ...newCenter, area: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    disabled={!selectedState}
                                >
                                    <option value="">Select Area</option>
                                    {filteredAreas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                                {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Browse
                                    </label>
                                    {newCenter.thumbnail && (
                                        <img
                                            src={newCenter.thumbnail}
                                            alt="Preview"
                                            className="ml-4 h-12 w-12 object-cover rounded-md"
                                        />
                                    )}
                                    {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                <div className="mt-1 flex items-center space-x-2">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        value={newCenter.rating}
                                        onChange={(e) => setNewCenter({ ...newCenter, rating: Number(e.target.value) })}
                                        className="block w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="text-yellow-400">★</span>
                                    <input
                                        type="number"
                                        placeholder="Total Reviews"
                                        value={newCenter.total_reviews}
                                        onChange={(e) => setNewCenter({ ...newCenter, total_reviews: Number(e.target.value) })}
                                        className="block w-32 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="text-gray-500 text-sm">reviews</span>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500">Weekdays</label>
                                        <input
                                            type="text"
                                            value={newCenter.working_weekdays}
                                            onChange={(e) => setNewCenter({ ...newCenter, working_weekdays: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 8:00 AM - 6:00 PM"
                                        />
                                        {errors.working_weekdays && <p className="mt-1 text-sm text-red-600">{errors.working_weekdays}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Saturday</label>
                                        <input
                                            type="text"
                                            value={newCenter.working_saturday}
                                            onChange={(e) => setNewCenter({ ...newCenter, working_saturday: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. 9:00 AM - 3:00 PM"
                                        />
                                        {errors.working_saturday && <p className="mt-1 text-sm text-red-600">{errors.working_saturday}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Sunday</label>
                                        <input
                                            type="text"
                                            value={newCenter.working_sunday}
                                            onChange={(e) => setNewCenter({ ...newCenter, working_sunday: e.target.value })}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g. Closed"
                                        />
                                        {errors.working_sunday && <p className="mt-1 text-sm text-red-600">{errors.working_sunday}</p>}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Premium Lounge', 'Free WiFi', 'Coffee Bar', 'Kids Area', 'Valet Parking'].map((amenity) => (
                                        <div key={amenity} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={amenity}
                                                checked={newCenter.amenities?.includes(amenity)}
                                                onChange={(e) => {
                                                    const updatedAmenities = e.target.checked
                                                        ? [...(newCenter.amenities || []), amenity]
                                                        : (newCenter.amenities || []).filter(a => a !== amenity);
                                                    setNewCenter({ ...newCenter, amenities: updatedAmenities });
                                                }}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor={amenity} className="ml-2 block text-sm text-gray-900">
                                                {amenity}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div> */}
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
                                                checked={newCenter.status === 'active'}
                                                onChange={(e) => setNewCenter({ ...newCenter, status: e.target.value as 'active' | 'inactive' })}
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="inactive"
                                                checked={newCenter.status === 'inactive'}
                                                onChange={(e) => setNewCenter({ ...newCenter, status: e.target.value as 'active' | 'inactive' })}
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
                                    setSelectedCenter(null);
                                    resetForm();
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedCenter ? handleUpdateCenter : handleAddCenter}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {selectedCenter ? 'Update Center' : 'Add Center'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceCenters; 