import React, { useState, useEffect } from 'react';
import MobileContainer from './MobileContainer';
import { ArrowLeft } from 'lucide-react';
import api from "../services/customer_api";

interface Booking {
    id: string;
    date: string;
    time: string;
    serviceCenter: {
        name: string;
        address: string;
    };
    vehicle: {
        model: string;
        plateNumber: string;
    };
    services: string[];
    package: string[];
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface BookingHistoryProps {
    onBack: () => void;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ onBack }) => {
    const userId = localStorage.getItem('customer_id');
    const [history, setHistory] = useState<Booking[]>([]);
    const [qrCode, setQrCode] = useState(null);
    const [loading, setLoading] = useState(true);

    const fecthHistory = async() => {
        await api.get(`/customer/booking-history?customer_id=${userId}`).then((response) => {
            const data = response.data.data;
            setHistory(data);
        }).catch((error: any) => {
            setHistory([]);
        })
    }
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const getStatusColor = (status: Booking['status']) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getQRCode = async(refNo: string) => {
        await api.get(`/customer/booking-qrcode/${refNo}`).then((response) => {
            const data = response.data.data;
            setQrCode(data.qrCode);
        }).catch((error: any) => {
            setQrCode(null);
        })
    }
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    useEffect(() => {
        fecthHistory()
    },[]);
    return (
        <MobileContainer>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="bg-white shadow">
                    <div className="px-4 py-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    if (selectedBooking) {
                                        setSelectedBooking(null)
                                    } else {
                                        onBack()
                                    }
                                }}
                                className="text-gray-600 hover:text-gray-800 flex items-center"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back
                            </button>
                            <h1 className="text-xl font-bold text-gray-900 ml-4">Booking History</h1>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto py-6 px-4">
                    {selectedBooking ? (
                        // Booking Details View
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">Booking #{selectedBooking.id}</h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {formatDate(selectedBooking.date)} at {new Date(selectedBooking.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                                    </span>
                                </div>

                                <div className="mt-6 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Service Center</h3>
                                        <p className="mt-2 text-sm text-gray-500">{selectedBooking.serviceCenter.name}</p>
                                        <p className="text-sm text-gray-500">{selectedBooking.serviceCenter.address}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Vehicle</h3>
                                        <p className="mt-2 text-sm text-gray-500">{selectedBooking.vehicle.model}</p>
                                        <p className="text-sm text-gray-500">Plate Number: {selectedBooking.vehicle.plateNumber}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Services</h3>
                                        <p>Package: {selectedBooking.package}</p>
                                        <ul className="mt-2 space-y-1">
                                            {selectedBooking.services.map((service, index) => (
                                                <li key={index} className="text-sm text-gray-500">{service}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Scan to View Booking Status</h3>
                                        {qrCode ? (
                                            <img src={qrCode} alt="Booking QR Code" className="mx-auto" />
                                        ) : (
                                            <p>QR code not available</p>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="mt-6 w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Back to Bookings
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Bookings List View
                        <div className="space-y-4">
                            {history && history.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => {
                                        setSelectedBooking(booking);
                                        if (booking.status.toLowerCase() !== "completed") {
                                            getQRCode(booking.id);
                                        } else {
                                            setQrCode(null)
                                        }
                                    }}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">Booking #{booking.id}</h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {formatDate(booking.date)} at {new Date(booking.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600">{booking.serviceCenter.name}</p>
                                            <p className="text-sm text-gray-600">{booking.vehicle.model} - {booking.vehicle.plateNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MobileContainer>
    );
};

export default BookingHistory; 