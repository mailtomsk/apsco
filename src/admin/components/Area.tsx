import React, { useState, useEffect } from 'react';
import { States, Areas } from '../../utils/helpers';
import adminClient from "../../services/adminClient";
import { toast } from "react-toastify";
import Pagination from './Pagination';
import { useSidebar } from "../context/SidebarContext";
import EditIcon from "../../assets/icons/edit";
import DeleteIcon from "../../assets/icons/delete";
const perPage = import.meta.env.VITE_PAGINATION

const Area: React.FC = () => {
    const [area, setArea] = useState<Areas[]>([]);
    const [state, setState] = useState<States[]>([]);
    const [showAreaForm, setShowAreaForm] = useState(false);
    const [selectedArea, setselectedArea] = useState<Areas | null>(null);
    const [selectedStateId, setSelectedStateId] = useState('');
    const [newArea, setNewArea] = useState<Partial<Areas>>({
        id: '',
        name: '',
        states: '',
        status: true
    });
    const [errorsArea, setErrorsArea] = useState({
        name: '',
        states: '',
        status: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = perPage;
    const totalPages = Math.ceil(area.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = area.slice(indexOfFirstItem, indexOfLastItem);

    const visiblePages = 3;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const validateAreaForm = () => {
        let isValid = true;
        const errorsAreas = {
            name: '',
            states: '',
            status: ''
        };
        if (!newArea.name?.trim()) {
            errorsAreas.name = 'Area name is required';
            isValid = false;
        }
        if (!selectedStateId) {
            errorsAreas.states = 'State name is required';
            isValid = false;
        }
        setErrorsArea(errorsAreas);
        return isValid;
    }
    const resetAreaForm = () => {
        setSelectedStateId('')
        setNewArea({
            name: '',
            states: '',
            status: true
        });
        setErrorsArea({
            name: '',
            states: '',
            status: ''
        });
    };
    const fetchAreas = async () => {
        await adminClient.get('/v1/areas').then((response) => {
            const { success, data } = response.data;
            if (success) {
                setArea(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }
    const fetchStates = async () => {
        await adminClient.get('/v1/states').then((response) => {
            const { success, data } = response.data;
            if (success) {
                setState(data);
            }
        }).catch((error: any) => {
            console.error(error);
        })
    }
    const handleUpdateArea = async (e: React.FormEvent) => {
        if (!selectedArea) return;
        e.preventDefault();
        if (validateAreaForm()) {
            if (confirm('Do you want update the Areas?')) {
                const formData = {
                    name: newArea.name,
                    code: newArea.name,
                    state_id: parseInt(selectedStateId),
                    status: newArea.status ? true : false,
                }
                adminClient.post(`/v1/areas/${newArea.id}/update`, formData).then((response) => {
                    const { success, message } = response.data;
                    if (success) {
                        toast.success(message);
                        setShowAreaForm(false);
                        resetAreaForm();
                        fetchAreas();
                    }
                }).catch((error) => {
                    toast.error(error.message)
                })
            }
        }
    }
    const handleAddArea = async (e: React.FormEvent) => {
        e.preventDefault()
        if (validateAreaForm()) {
            const formData = {
                name: newArea.name,
                code: newArea.name,
                state_id: parseInt(selectedStateId),
                status: newArea.status ? true : false,
            }
            adminClient.post(`/v1/areas/create`, formData).then((response) => {
                const { success, message } = response.data;
                if (success) {
                    toast.success(message);
                    setShowAreaForm(false);
                    resetAreaForm();
                    fetchAreas();
                }
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    }
    const handleEditAreas = async (area: Areas) => {
        setselectedArea(area)
        setNewArea(area)
        console.log(area);
        console.log(state);
        const stateId = state.find((b) => b.name === area.states)?.id || '';
        setSelectedStateId(stateId)
        setShowAreaForm(true)
    }
    const handleDeleteAreas = async (id: number) => {
        if (confirm('Do you want update the Model?')) {
            adminClient.get(`/v1/areas/${id}/delete`).then((response) => {
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
        fetchAreas();
        fetchStates()
    }, [])

    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Areas</h2>
                <button
                    onClick={() => {
                        setselectedArea(null);
                        setShowAreaForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-2 py-2 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300">
                    Add Areas
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
                                State
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
                            currentItems.map((area) => (
                                <tr key={area.id}>
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{area.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{area.states}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-1 py-1 whitespace-nowrap">
                                        <button
                                            className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-theme-xs ${area.status
                                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                                                }`}
                                        >
                                            {area.status ? 'Ative' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEditAreas(area)}
                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                        >
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                                                <EditIcon />
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAreas(parseInt(area.id))}
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

            {showAreaForm && ( 
                <div
                    className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full ${
                        !isExpanded && !isHovered ? '' : 'lg:pl-[290px]'
                    }`}
                > 
                    <div className="relative top-20 mx-auto p-5 border w-1/4 shadow-lg rounded-md bg-white">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">
                                {showAreaForm ? 'Edit Area' : 'Add Area'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowAreaForm(false);
                                    setselectedArea(null);
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
                                    value={newArea.name}
                                    onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter service name"
                                />
                                {errorsArea.name && <p className="mt-1 text-sm text-red-600">{errorsArea.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <select
                                    value={selectedStateId}
                                    onChange={(e) => setSelectedStateId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Car Brand</option>
                                    {state.map((value) => (
                                        <option key={value.id} value={value.id}>
                                            {value.name}
                                        </option>
                                    ))}
                                </select>
                                {errorsArea.states && <p className="mt-1 text-sm text-red-600">{errorsArea.states}</p>}
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
                                                checked={newArea.status === true}
                                                onChange={(e) => setNewArea({ ...newArea, status: true })}
                                            />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value="inactive"
                                                checked={newArea.status === false}
                                                onChange={(e) => setNewArea({ ...newArea, status: false })}
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
                                    setShowAreaForm(false);
                                    setselectedArea(null);
                                    resetAreaForm();
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-2 py-2 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedArea ? handleUpdateArea : handleAddArea}
                                className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-2 py-2 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                            >
                                {selectedArea ? 'Update Areas' : 'Add Areas'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Area;