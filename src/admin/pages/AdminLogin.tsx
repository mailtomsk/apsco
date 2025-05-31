import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../utils/helpers';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from '../../auth/adminAuthSlice';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';
import AppLogo from '../../components/AppLogo';

interface AdminLoginProps {
    onLogin?: (isAuth: boolean) => boolean;
}

type FormData = yup.InferType<typeof loginSchema>;

const AdminLogin: React.FC<AdminLoginProps> = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(loginSchema),
    });
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { _adminToken } = useSelector((state: RootState) => state.auth.adminAuth);
    const isRehydrated = useSelector((state: RootState) => state.auth._persist.rehydrated);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            const loginUser = await dispatch(login(data));
            if (login.fulfilled.match(loginUser)) {
                setLoading(false);
                if (loginUser.payload._adminToken) {
                    toast.success('Login successfully!')
                } else {
                    toast.error(loginUser.payload.message);
                }
            } else {
                setLoading(false);
                toast.error(loginUser.payload as string);
            }
        } catch (error) {
            toast.error(error as string);
        }
    }

    useEffect(() => {
        if (_adminToken && isRehydrated) {
            navigate('/admin/dashboard');
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="text-center mb-8">
                            <AppLogo isChangeHeight={true} isCenterAlign={true}/>
                            {/* <h1 className="text-3xl font-bold text-gray-800">TISCO Admin</h1> */}
                            <p className="text-gray-600 mt-2">Sign in to your admin account</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('username')}
                                />
                                {errors.username && <p className="text-red-500 mt-1">{errors.username.message}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register('password')}
                                />
                                {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" disabled={isLoading ? true : false}
                            >
                                {isLoading && <Loader className="animate-spin" />} &nbsp; Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin; 