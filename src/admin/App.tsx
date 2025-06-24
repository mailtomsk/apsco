import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import ServiceCenters from './pages/ServiceCenters';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, persistor } from '../store';
import { adminLogout } from '../auth/adminAuthSlice';
import { profile } from '../services/adminService';
import { toast } from 'react-toastify';
import Services from './pages/Services';
import CarDetails from './pages/CarDetails';
import StateAndArea from './pages/StateAndArea';

const AdminApp: React.FC = () => {
    const { _adminToken } = useSelector((state: RootState) => state.auth.adminAuth);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (_adminToken) {
            setIsAuthenticated(true);
            navigate('/admin/dashboard');
            getUser();
        }
    }, [_adminToken])

    const handleLogout = () => {
        setIsAuthenticated(false);
        dispatch(adminLogout());
        persistor.purge();
        navigate('/admin/login');
    };

    const getUser = async() => {
        await profile().then((response) => {
            const {success} = response
            if(!success) {
                handleLogout();
            }
        }).catch((error) => {
            toast.error(error.message);
            handleLogout();
        });
    }

    return (
        <Routes>
            <Route
                path="login"
                element={
                    isAuthenticated ? (
                        <Navigate to="/admin/dashboard" replace />
                    ) : (
                        <AdminLogin />
                    )
                }
            />
            <Route
                path="*"
                element={
                    isAuthenticated ? (
                        <AdminLayout onLogout={handleLogout}>
                            <Routes>
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="service-centers" element={<ServiceCenters />} />
                                <Route path="bookings" element={<Bookings />} />
                                <Route path="customers" element={<Customers />} />
                                <Route path="services" element={<Services />} />
                                <Route path="car-details" element={<CarDetails />} />
                                <Route path="state-area" element={<StateAndArea />} />
                                <Route path="settings" element={<Settings />} />
                                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                            </Routes>
                        </AdminLayout>
                    ) : (
                        <Navigate to="/admin/login" replace />
                    )
                }
            />
        </Routes>
    );
};

export default AdminApp; 