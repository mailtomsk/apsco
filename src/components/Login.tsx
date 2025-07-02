import React, { useState, useEffect } from 'react';
import MobileContainer from './MobileContainer';
import { useAppDispatch, useAppSelector } from "../hooks";
import { customerLogin } from "../auth/customerAuthSlice";
import { toast } from 'react-toastify';
import AppLogo from './AppLogo';
import TogglePasswordButton from './TogglePasswordButton';

interface LoginProps {
    onLoginSuccess: () => void;
    onSignUpClick: () => void;
    onForgotPasswordClick: () => void;
    onDone: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSignUpClick, onForgotPasswordClick, onDone }) => {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const validateForm = () => {
        let isValid = true
        const newErrors = {
            email: '',
            password: ''
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    }


    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
            await dispatch(customerLogin({ email, password, rememberMe })).then((response) => {
                if (response.payload.status) {
                    onLoginSuccess();
                    //toast.success(response.payload.message)
                    onDone();
                } else {
                    toast.error(response.payload.message)
                }
            }).catch((error: any) => {
                toast.error(error.response.payload.message)
            })
        }
    };
    useEffect(() => {
        const stored = localStorage.getItem('rememberMe');
        if (stored === 'true') setRememberMe(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('rememberMe', rememberMe.toString());
    }, [rememberMe]);
    return (
        <MobileContainer>
            <div className="min-h-screen bg-white px-4 py-8">
                {/* Logo and Title */}
                <div className="text-center mb-12">
                    <AppLogo isChangeHeight={true}/>
                    {/* <h1 className="mt-2 text-2xl font-bold text-blue-600">TISCO</h1> */}
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Welcome back</h2>
                    <p className="mt-2 text-sm text-gray-600">Please sign in to continue</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-[18px] text-gray-800">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-[18px] text-gray-800">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 text-[16px] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        <TogglePasswordButton
                            showPassword={showPassword}
                            togglePassword={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                // checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={onForgotPasswordClick}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign in
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">Don't have an account? </span>
                        <button
                            type="button"
                            onClick={onSignUpClick}
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </MobileContainer>
    );
};

export default Login; 