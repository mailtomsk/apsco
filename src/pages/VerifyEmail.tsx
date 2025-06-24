import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../services/customer_api';
import { toast } from 'react-toastify';
import AppLogo from '../components/AppLogo';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const verifyEmail = async () => {       
        try {
            const response = await api.post('/customer/verify-email', { token });
            toast.success(response.data.message || "Email verified successfully");
            setStatus('success');
            setTimeout(() => navigate('/'), 3000)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Verification failed");
            setStatus('error');
            setTimeout(() => navigate('/'), 3000)
        }
    };

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            toast.error("No verification token provided");
            setStatus('error');
        }
    }, [token]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="min-h-screen bg-gray-100 flex justify-center">
                <div className="w-full max-w-[420px] bg-white min-h-screen shadow-lg">
                    <div className="min-h-screen bg-white px-4 py-8">
                        <div className="text-center">
                            <AppLogo isChangeHeight={true} />
                            <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">Email Verifiaction</h2>
                            <p className="mt-2 text-center text-gray-600">Please verifi your email.</p>
                        </div>
                        <div className="flex flex-col justify-center items-center mt-10 space-y-6 text-center">
                            {status === 'loading' && (
                                <>
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-600">Email verification processing...</p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-green-600 font-semibold">Your email has been successfully verified!</p>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <p className="text-red-600 font-semibold">Email verification failed. Please try again.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>  
    );
};

export default VerifyEmail;
