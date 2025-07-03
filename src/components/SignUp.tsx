import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileContainer from './MobileContainer';
import api from "../services/customer_api";
import { toast } from "react-toastify";
import AppLogo from './AppLogo';
import TogglePasswordButton from './TogglePasswordButton';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { customerLogin } from '../auth/customerAuthSlice';

interface SignUpProps {
    onBackToLogin: () => void;
    onLoginSuccess: () => void;
}
interface CustomerFormData {
    fullName: string,
    email: string,
    mobile: string,
    password: string,
    confirmPassword: string,
    driversLicense: File | null;
}

const SignUp: React.FC<SignUpProps> = ({ onBackToLogin, onLoginSuccess }) => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmshowPassword, setConfirmShowPassword] = useState(false);
    const [formData, setFormData] = useState<CustomerFormData>({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        driversLicense: null as File | null
    });
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        driversLicense: ''
    });
    const { selectedState, selectedArea, selectedCenter } = useAppSelector((state) => state.auth.booking);
    const { appointmentDate, appointmentTime } = useAppSelector((state) => state.auth.booking);
    const { carDetails } = useAppSelector((state) => state.auth.booking);
    const { serviceDetails } = useAppSelector((state) => state.auth.booking);
    const dispatch = useAppDispatch()

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            fullName: '',
            email: '',
            mobile: '',
            password: '',
            confirmPassword: '',
            driversLicense: ''
        };

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
            isValid = false;
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        // Mobile validation
        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
            isValid = false;
        } else if (!/^\d{10,11}$/.test(formData.mobile)) {
            newErrors.mobile = 'Please enter a valid mobile number';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // Drivers License validation
        if (!formData.driversLicense) {
            newErrors.driversLicense = 'Please upload your drivers license';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const fileFormData = new FormData();
            fileFormData.append("full_name", formData.fullName);
            fileFormData.append("email", formData.email);
            fileFormData.append("mobile", formData.mobile);
            fileFormData.append("password", formData.password);
            fileFormData.append("confirm_password", formData.confirmPassword);
            if (selectedFile) {
                fileFormData.append("drivers_license", selectedFile);
            } else {
                alert("No file selected for driver's license.");
            }
            const newBookingRef = 'BK' + Math.random().toString(36).substring(2, 10).toUpperCase();
            const datas = {
                choose_state: selectedState?.name,
                choose_city: selectedArea?.name,
                center_id: selectedCenter?.id,
                appointment_date: appointmentDate,
                appointment_time: appointmentTime,
                car_brand: carDetails?.brand,
                car_model: carDetails?.model,
                manufacturing_year: carDetails?.year,
                car_number: carDetails?.plateNumber,
                services: serviceDetails?.selectedServices,
                remark: serviceDetails?.remarks,
                packageType:serviceDetails?.packageType,
                reference_no: newBookingRef
            }

            fileFormData.append("choose_state", datas.choose_state ?? "");
            fileFormData.append("choose_city", datas.choose_city ?? "");
            fileFormData.append("center_id", datas.center_id?.toString() ?? "");
            fileFormData.append("appointment_date", datas.appointment_date ?? "");
            fileFormData.append("appointment_time", datas.appointment_time ?? "");
            fileFormData.append("car_brand", datas.car_brand ?? "");
            fileFormData.append("car_model", datas.car_model ?? "");
            fileFormData.append("manufacturing_year", datas.manufacturing_year ?? "");
            fileFormData.append("car_number", datas.car_number ?? "");
            fileFormData.append("services", (datas.services ?? []).join(","));
            fileFormData.append("remark", datas.remark ?? "");
            fileFormData.append("packageType", datas.packageType ?? "");
            fileFormData.append("reference_no", datas.reference_no ?? "");

            await api.post(`/customer/register`, fileFormData, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then(async (response) => {
                toast.success(response.data.message);
                onBackToLogin();
                navigate('/register-complete')
            }).catch((error) => {
                const { data, message } = error.response.data; 
                if (Array.isArray(data) && data.length > 0) {
                    const errorMessage = data.map(value => value.msg).join(', ');
                    toast.error(errorMessage)
                } else if (message) {
                    toast.error(message)
                } else {
                    toast.error("Something went wrong");
                }
            })
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                driversLicense: file
            }));
            setSelectedFile(file);
        } else {
            setErrors(prev => ({
                ...prev,
                driversLicense: ''
            }));
        }
    };
    const onSignUpSuccessNew = () => {
        navigate('/register-complete');
    }
    return (
        <MobileContainer>
            {/* <div className="min-h-screen flex items-center justify-center bg-gray-50"> */}
            <div className="min-h-screen bg-white px-4 py-8">
                {/* <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md"> */}
                <div className="text-left mb-12">
                    {/* Car Icon */}
                    <div className="text-center">
                        <AppLogo isChangeHeight={true} />
                        <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-center text-gray-600">Please fill in your details</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-[18px] text-gray-800">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[16px] text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-[18px] text-gray-800">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[16px] text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Mobile */}
                            <div>
                                <label htmlFor="mobile" className="block text-[18px] text-gray-800">
                                    Mobile
                                </label>
                                <input
                                    id="mobile"
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[16px] text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-[18px] text-gray-800">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[16px] text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                <TogglePasswordButton
                                    showPassword={showPassword}
                                    togglePassword={() => setShowPassword(!showPassword)}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block text-[18px] text-gray-800">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type={confirmshowPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[16px] text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                <TogglePasswordButton
                                    showPassword={confirmshowPassword}
                                    togglePassword={() => setConfirmShowPassword(!confirmshowPassword)}
                                />
                            </div>

                            {/* Drivers License Upload */}
                            <div>
                                <label htmlFor="driversLicense" className="block text-[18px] text-gray-800">
                                    Upload Lalamove profile image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                            >
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                                {formData.driversLicense && (
                                    <p className="mt-2 text-sm text-green-600">
                                        File selected: {formData.driversLicense.name}
                                    </p>
                                )}
                                {errors.driversLicense && <p className="mt-1 text-sm text-red-600">{errors.driversLicense}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Create Account
                            </button>
                        </div>

                        <div className="text-center text-sm">
                            <span className="text-gray-600">Already have an account? </span>
                            <button
                                type="button"
                                onClick={onBackToLogin}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MobileContainer>
    );
};

export default SignUp; 