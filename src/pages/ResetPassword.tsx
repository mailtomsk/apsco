import React, { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import AppLogo from '../components/AppLogo';
import api from "../services/customer_api";
import { toast } from "react-toastify";
import TogglePasswordButton from '../components/TogglePasswordButton';

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [confirmshowPassword, setConfirmShowPassword] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
    })

    const validateForm = () => { 
        let isValid = true;
        const newErrors = {
            password: '',
            confirmPassword: '',
        }
        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm Password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) { 
            await api.post('/customer/reset-password', { token, password, confirmPassword }).then((response) => {
                toast.success(response.data.message)
                navigate("/")
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="min-h-screen bg-gray-100 flex justify-center">
                <div className="w-full max-w-[420px] bg-white min-h-screen shadow-lg">
                    <div className="min-h-screen bg-white px-4 py-8">
                        <div className="text-center">
                            <AppLogo isChangeHeight={true} />
                            <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">Reset Password</h2>
                            <p className="mt-2 text-center text-gray-600">Please add Password and Confirm Password</p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Password */}
                                <div className="relative">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    <TogglePasswordButton
                                        showPassword={showPassword}
                                        togglePassword={() => setShowPassword(!showPassword)}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type={confirmshowPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                    <TogglePasswordButton
                                        showPassword={confirmshowPassword}
                                        togglePassword={() => setConfirmShowPassword(!confirmshowPassword)}
                                    />
                                </div>

                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;