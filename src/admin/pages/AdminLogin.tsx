import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

import { login } from '../../auth/adminAuthSlice';
import { loginSchema } from '../../utils/helpers';
import { AppDispatch, RootState } from '../../store';
import AuthLayout from '../../auth/AuthPageLayout';
import EyeCloseIcon from "../../assets/icons/eye-close";
import EyeIcon from "../../assets/icons/eye";

interface AdminLoginProps {
    onLogin?: (isAuth: boolean) => boolean;
}

type FormData = yup.InferType<typeof loginSchema>;

const AdminLogin: React.FC<AdminLoginProps> = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
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
        <AuthLayout>
            <div className="flex flex-col flex-1">
                <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <div>
                        <div className="mb-2 sm:mb-8">
                            <h1 className="font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                                Sign In
                            </h1>
                        </div>
                        <div>
                            {/* <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-6">
                                    <div>
                                        <Label>
                                            Email <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Enter user name"
                                        />
                                        {errors.username && <p className="text-red-500 mt-1">{errors.username.message}</p>}
                                    </div>
                                    <div>
                                        <Label>
                                            Password <span className="text-error-500">*</span>{" "}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                            />
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                            >
                                                {showPassword ? (
                                                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                ) : (
                                                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                                )}
                                            </span>
                                            {errors.password && <p className="text-red-500 mt-1">{errors.password.message}</p>}
                                        </div>
                                    </div>
                                    <div>   
                                        <Button
                                            className="w-full" size="sm"
                                            disabled={isLoading ? true : false}
                                        >
                                            {isLoading && <Loader className="animate-spin" />} &nbsp;Sign in
                                        </Button>
                                    </div>
                                </div>
                            </form> */}
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-4">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor="username">
                                        Username
                                        <span className="text-error-500">*</span>{" "}
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                                        placeholder="Enter user name"
                                        {...register('username')}
                                    />
                                    {errors.username && <p className="text-red-500 mt-1">{errors.username.message}</p>}
                                </div>

                                <div className="mb-6">
                                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400" htmlFor="password">
                                        Password
                                        <span className="text-error-500">*</span>{" "}
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                                            placeholder="Enter your password"
                                            {...register('password')}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                        {showPassword ? (
                                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        )}
                                        </span>
                                    </div>
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
        </AuthLayout>
    );
};

export default AdminLogin; 