import React, { useState, useEffect } from 'react';
import { CarBrand } from '../../utils/helpers';
import adminClient from "../../services/adminClient";
import { toast } from "react-toastify";
import Pagination from './Pagination';
import { useSidebar } from "../context/SidebarContext";
import EditIcon from "../../assets/icons/edit";
import DeleteIcon from "../../assets/icons/delete";
const perPage = import.meta.env.VITE_PAGINATION

const CarBrands: React.FC = () => {
    const [carBrand, setCarBrand] = useState<CarBrand[]>([]);
    const [showBrandForm, setShowBrandForm] = useState(false);
    const [selectedBrand, setselectedBrand] = useState<CarBrand | null>(null);
    const [newBrand, setNewBrand] = useState<Partial<CarBrand>>({
        id: '',
        name: '',
        status: true
    });
    const [errorsBrand, setErrorsBrand] = useState({
        name: '',
        status: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(carBrand.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = carBrand.slice(indexOfFirstItem, indexOfLastItem);
    
    const visiblePages = 3;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const validateBrandForm = () => {
        let isValid = true;
        const errorsBrand = {
            name: '',
            status: ''
        };
        if (!newBrand.name?.trim()) {
            errorsBrand.name = 'Brand name is required';
            isValid = false;
        }
        setErrorsBrand(errorsBrand);
        return isValid;
    }
    const resetBrandForm = () => {
        setNewBrand({
            name: '',
            status: true
        });
        setErrorsBrand({
            name: '',
            status: ''
        });
    };
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

    const handleAddCarBrand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateBrandForm()) {
            const formData = {
                name: newBrand.name,
                code: newBrand.name,
                status: newBrand.status ? true : false,
            }
            adminClient.post(`/v1/carBrand/create`, formData).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    setShowBrandForm(false);
                    resetBrandForm();
                    fetchCarBrand();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    }
    const handleUpdateCarBrand = async (e: React.FormEvent) => {
        if (!showBrandForm) return;
        e.preventDefault();
        if (validateBrandForm()) {
            console.log(newBrand);
            if (confirm('Do you want update the brand?')) {
                const formData = {
                    name: newBrand.name,
                    code: newBrand.name,
                    status: newBrand.status,
                }
                adminClient.post(`/v1/carBrand/${newBrand.id}/update`, formData).then((response) => {
                    const { success, message } = response.data;
                    if (success) {
                        toast.success(message);
                        setShowBrandForm(false);
                        resetBrandForm();
                        fetchCarBrand();
                    }
                }).catch((error) => {
                    toast.error(error.message)
                })
            }
        }
    }
    const handleEditCarBrand = async (brand: CarBrand) => {
        setselectedBrand(brand);
        setNewBrand(brand);
        setShowBrandForm(true);
    }
    const handleDeleteCarBrand = async (id: number) => {
        if (confirm('Are you sure you want to delete?')) {
            adminClient.get(`/v1/carBrand/${id}/delete`).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    fetchCarBrand();
                    setCurrentPage(1);
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    }
    
    useEffect(() => {
        fetchCarBrand()
    }, [])

    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

    return (
        <>
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Car Brand</h2>
                <button
                    onClick={() => {
                        setselectedBrand(null);
                        setShowBrandForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition bg-white px-2 py-2 text-sm text-brand-600 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 hover:text-white border border-brand-600 ">
                    Add Car Brand
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="border-b border-gray-100 dark:border-white/[0.05]">
                        <tr>
                            <th className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Name
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
                            currentItems.map((brand) => (
                                <tr key={brand.id}>
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{brand.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-1 whitespace-nowrap">
                                        <button
                                            className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs ${brand.status
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                }`}
                                        >
                                            {brand.status ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEditCarBrand(brand)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                <EditIcon /> 
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCarBrand(parseInt(brand.id))}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                <DeleteIcon />
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


            {showBrandForm && ( 
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${
                        !isExpanded && !isHovered ? '' : 'lg:pl-[290px]'
                    }`}
                > 
                    <div className="relative top-20 mx-auto p-5 border w-1/2 md:w-1/4 shadow-lg rounded-md bg-white">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                {selectedBrand ? 'Edit Brand' : 'Add New Brand'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowBrandForm(false);
                                    setselectedBrand(null);
                                    resetBrandForm();
                                }}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="md:grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={newBrand.name}
                                    maxLength={50}
                                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter Car-Brand name"
                                />
                                {errorsBrand.name && <p className="mt-1 text-sm text-red-600">{errorsBrand.name}</p>}
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
                                                checked={newBrand.status === true}
                                                onChange={(e) => setNewBrand({ ...newBrand, status: true })}
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="inactive"
                                                checked={newBrand.status === false}
                                                onChange={(e) => setNewBrand({ ...newBrand, status: false })}
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
                                    setShowBrandForm(false);
                                    setselectedBrand(null);
                                    resetBrandForm();
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-2 py-2 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedBrand ? handleUpdateCarBrand : handleAddCarBrand}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-2 py-2 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                            >
                                {selectedBrand ? 'Update Brand' : 'Add Brand'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>    
    )
}

export default CarBrands;