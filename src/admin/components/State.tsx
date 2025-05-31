import React, { useState, useEffect } from 'react';
import { States } from '../../utils/helpers';
import adminClient from "../../services/adminClient";
import { toast } from "react-toastify";
import Pagination from './Pagination';
import { useSidebar } from "../context/SidebarContext";
const perPage = import.meta.env.VITE_PAGINATION

const State: React.FC = () => {
    const [states, setStates] = useState<States[]>([]);
    const [showStatesForm, setShowStatesForm] = useState(false);
    const [selectedStates, setselectedStates] = useState<States | null>(null);
    const [newStates, setNewStates] = useState<Partial<States>>({
        id: '',
        name: '',
        status: true
    });
    const [errorsState, setErrorsState] = useState({
        name: '',
        status: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(states.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = states.slice(indexOfFirstItem, indexOfLastItem);

    const visiblePages = 3;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const validateStatesForm = () => {
        let isValid = true;
        const errorsStates = {
            name: '',
            status: ''
        };
        if (!newStates.name?.trim()) {
            errorsStates.name = 'State name is required';
            isValid = false;
        }
        setErrorsState(errorsStates);
        return isValid;
    }
    const resetStatesForm = () => {
        setNewStates({
            name: '',
            status: true
        });
        setErrorsState({
            name: '',
            status: ''
        });
    };
    const fetchStates = async () => {
        await adminClient.get('/v1/states').then((response) => {
            const { success, data } = response.data;
            if (success) {
                setStates(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }

    const handleAddStates = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStatesForm()) {
            const formData = {
                name: newStates.name,
                code: newStates.name,
                status: newStates.status ? true : false,
            }
            adminClient.post(`/v1/states/create`, formData).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    setShowStatesForm(false);
                    resetStatesForm();
                    fetchStates();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    }
    const handleUpdateStates = async (e: React.FormEvent) => {
        if (!showStatesForm) return;
        e.preventDefault();
        if (validateStatesForm()) {
            if (confirm('Do you want update the State?')) {
                const formData = {
                    name: newStates.name,
                    code: newStates.name,
                    status: newStates.status,
                }
                adminClient.post(`/v1/states/${newStates.id}/update`, formData).then((response) => {
                    const { success, message } = response.data;
                    if (success) {
                        toast.success(message);
                        setShowStatesForm(false);
                        resetStatesForm();
                        fetchStates();
                    }
                }).catch((error) => {
                    toast.error(error.message)
                })
            }
        }
    }
    const handleEditStates = async (states: States) => {
        setselectedStates(states);
        setNewStates(states);
        setShowStatesForm(true);
    }
    const handleDeleteStates = async (id: number) => {
        if (confirm('Do you want update the Brand?')) {
            adminClient.get(`/v1/states/${id}/delete`).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    fetchStates();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    }

    useEffect(() => {
        fetchStates()
    }, [])

    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    
    return (
        <>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">States</h2>
                <button
                    onClick={() => {
                        setselectedStates(null);
                        setShowStatesForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add States
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <button
                                            className={`mr-1 px-1 py-1 rounded-md ${brand.status
                                                ? 'bg-green-50 text-green-400 hover:bg-green-100'
                                                : 'bg-red-50 text-red-400 hover:bg-red-100'
                                                }`}
                                        >
                                            {brand.status ? 'Ative' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEditStates(brand)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.9888 4.28491L19.6405 2.93089C18.4045 1.6897 16.4944 1.6897 15.2584 2.93089L13.0112 5.30042L18.7416 11.055L21.1011 8.68547C21.6629 8.1213 22 7.33145 22 6.54161C22 5.75176 21.5506 4.84908 20.9888 4.28491Z" fill="#030D45"/>
                                                    <path d="M16.2697 10.9422L11.7753 6.42877L2.89888 15.3427C2.33708 15.9069 2 16.6968 2 17.5994V21.0973C2 21.5487 2.33708 22 2.89888 22H6.49438C7.2809 22 8.06742 21.6615 8.74157 21.0973L17.618 12.1834L16.2697 10.9422Z" fill="#030D45"/>
                                                </svg> 
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStates(parseInt(brand.id))}
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


            {showStatesForm && ( 
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${
                        !isExpanded && !isHovered ? '' : 'lg:pl-[290px]'
                    }`}
                > 
                    <div className="relative top-20 mx-auto p-5 border w-1/4 shadow-lg rounded-md bg-white">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                {selectedStates ? 'Edit States' : 'Add New States'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowStatesForm(false);
                                    setselectedStates(null);
                                    resetStatesForm();
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
                                    value={newStates.name}
                                    onChange={(e) => setNewStates({ ...newStates, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter Car-Brand name"
                                />
                                {errorsState.name && <p className="mt-1 text-sm text-red-600">{errorsState.name}</p>}
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
                                                checked={newStates.status === true}
                                                onChange={(e) => setNewStates({ ...newStates, status: true })}
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="inactive"
                                                checked={newStates.status === false}
                                                onChange={(e) => setNewStates({ ...newStates, status: false })}
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
                                    setShowStatesForm(false);
                                    setselectedStates(null);
                                    resetStatesForm();
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedStates ? handleUpdateStates : handleAddStates}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {selectedStates ? 'Update States' : 'Add States'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default State;