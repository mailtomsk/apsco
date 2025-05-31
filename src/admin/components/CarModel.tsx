import React, { useState, useEffect } from 'react';
import { CarModel, CarBrand } from '../../utils/helpers';
import adminClient from "../../services/adminClient";
import { toast } from "react-toastify";
import Pagination from './Pagination';
import { useSidebar } from "../context/SidebarContext";
const perPage = import.meta.env.VITE_PAGINATION


const CarModels: React.FC = () => { 
    const [carModel, setCarModel] = useState<CarModel[]>([]);
    const [carBrand, setCarBrand] = useState<CarBrand[]>([]);
    const [showModelForm, setShowModelForm] = useState(false);
    const [selectedModel, setselectedModel] = useState<CarModel | null>(null);
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [newModel, setNewModel] = useState<Partial<CarModel>>({
        id: '',
        name: '',
        description: '',
        brand: '',
        status: true
    });
    const [errorsModel, setErrorsModel] = useState({
        name: '',
        description: '',
        brand: '',
        status: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(carModel.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = carModel.slice(indexOfFirstItem, indexOfLastItem);

    const visiblePages = 3;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const validateModelForm = () => {
        let isValid = true;
        const errorsModel = {
            name: '',
            description: '',
            brand: '',
            status: ''
        };
        if (!newModel.name?.trim()) {
            errorsModel.name = 'Brand name is required';
            isValid = false;
        }
        if (!selectedBrandId) {
            errorsModel.brand = 'Brand name is required';
            isValid = false;
        }
        setErrorsModel(errorsModel);
        return isValid;
    }
    const resetModelForm = () => {
        setSelectedBrandId('')
        setNewModel({
            name: '',
            description: '',
            brand: '',
            status: true
        });
        setErrorsModel({
            name: '',
            description: '',
            brand: '',
            status: ''
        });
    };
    const fetchCarModel = async () => {
        await adminClient.get('/v1/carModel').then((response) => {
            const { success, data } = response.data;
            if (success) {
                setCarModel(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }
    const fetchCarBrand = async () => {
        await adminClient.get('/v1/carBrand').then((response) => {
            const { success, data } = response.data;
            if (success) {
                setCarBrand(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }
    const handleUpdateCarModel = async (e: React.FormEvent) => {
        if (!selectedModel) return;
        e.preventDefault();
        if (validateModelForm()) {
            console.log(newModel);
            if (confirm('Do you want update the Model?')) {
                const formData = {
                    name: newModel.name,
                    code: newModel.name,
                    car_brand_id: parseInt(selectedBrandId),
                    status: newModel.status ? true : false,
                }
                adminClient.post(`/v1/carModel/${newModel.id}/update`, formData).then((response) => {
                    const { success, message } = response.data;
                    if (success) {
                        toast.success(message);
                        setShowModelForm(false);
                        resetModelForm();
                        fetchCarModel();
                    }
                }).catch((error) => {
                    toast.error(error.message)
                })
            }
        }
    }
    const handleAddCarModel = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateModelForm()) {
            const formData = {
                name: newModel.name,
                code: newModel.name,
                car_brand_id: parseInt(selectedBrandId),
                status: newModel.status ? true : false,
            }
            adminClient.post(`/v1/carModel/create`, formData).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    setShowModelForm(false);
                    resetModelForm();
                    fetchCarModel();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    }
    const handleEditCarModel = async (model: CarModel) => {
        setselectedModel(model)
        setNewModel(model)
        const carBrandId = carBrand.find((b) => b.name === model.brand)?.id || '';
        setSelectedBrandId(carBrandId)
        setShowModelForm(true)
    }
    const handleDeleteCarModel = async (id: number) => {
        if (confirm('Do you want update the Model?')) {
            adminClient.get(`/v1/carModel/${id}/delete`).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    fetchCarBrand();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    }
    useEffect(() => {
        fetchCarModel();
        fetchCarBrand()
    }, [])

    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Car Model</h2>
                <button
                    onClick={() => {
                        setselectedModel(null);
                        setShowModelForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add Car Model
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Brand
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
                            currentItems.map((model) => (
                                <tr key={model.id}>
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{model.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{model.brand}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <button
                                            className={`mr-1 px-1 py-1 rounded-md ${model.status
                                                ? 'bg-green-50 text-green-400 hover:bg-green-100'
                                                : 'bg-red-50 text-red-400 hover:bg-red-100'
                                                }`}
                                        >
                                            {model.status ? 'Ative' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEditCarModel(model)}
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
                                            onClick={() => handleDeleteCarModel(parseInt(model.id))}
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
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Data not found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {/* Pagination Section */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        visiblePages={3}
                    />
                )}
            </div>

            {showModelForm && ( 
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${
                        !isExpanded && !isHovered ? '' : 'lg:pl-[290px]'
                    }`}
                > 
                    <div className="relative top-20 mx-auto p-5 border w-1/4 shadow-lg rounded-md bg-white">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                {selectedModel ? 'Edit Model' : 'Add New Model'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModelForm(false);
                                    setselectedModel(null);
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={newModel.name}
                                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter service name"
                                />
                                {errorsModel.name && <p className="mt-1 text-sm text-red-600">{errorsModel.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <select
                                    value={selectedBrandId}
                                    onChange={(e) => setSelectedBrandId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Car Brand</option>
                                    {carBrand.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errorsModel.brand && <p className="mt-1 text-sm text-red-600">{errorsModel.brand}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <div className="mt-2">
                                    <div className="flex items-center space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="active"
                                                checked={newModel.status === true}
                                                onChange={(e) => setNewModel({ ...newModel, status: true })}
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="inactive"
                                                checked={newModel.status === false}
                                                onChange={(e) => setNewModel({ ...newModel, status: false })}
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
                                    setShowModelForm(false);
                                    setselectedModel(null);
                                    resetModelForm();
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedModel ? handleUpdateCarModel : handleAddCarModel}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {selectedModel ? 'Update Model' : 'Add Model'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CarModels;