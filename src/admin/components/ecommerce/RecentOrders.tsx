import {Table,TableBody,TableCell,TableHeader,TableRow,} from "../ui/table";
import Badge from "../ui/badge/Badge";
import adminClient from "../../../services/adminClient";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

interface Product {
    id: string;
    reference_no: string;
    bookingDate: string;
    bookingTime: string;
    customerName: string;
    serviceCenterName: string;
    vehicleDetails: {
        model: string;
        plateNumber: string;
    };
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    serviceType: 'Regular Maintenance' | 'Repair' | 'Inspection' | 'Body Work';
    notes?: string;
    packageType?: string;
}
export default function RecentOrders() {
    const [tableData, setTableData] = useState<Product[]>([])
    const getRecentBooking = async () => {
        await adminClient.get('/v1/bookings?top=3').then((response) => {
            const { success, data } = response.data;
            if (success) {
                setTableData(data);
            }
        }, (error: any) => {
            console.error(error)
        })
    }
    
    useEffect(() => {
        getRecentBooking();
    }, [])

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Recent Booking
                    </h3>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/bookings"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                    >
                        See all
                    </Link>
                </div>
            </div>
            <div className="max-w-full overflow-x-auto">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                        <TableRow>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Booking Details
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Customer & Vehicle
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Service Center
                            </TableCell>
                            <TableCell
                                isHeader
                                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                            >
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    {/* Table Body */}

                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {tableData.map((booking) => (
                            <TableRow key={booking.id} className="">
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                                #{booking.reference_no}
                                            </p>
                                            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                                {booking.bookingDate} at {booking.bookingTime}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {booking.vehicleDetails.model} - {booking.vehicleDetails.plateNumber}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    {booking.serviceCenterName}
                                </TableCell>
                                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                    <Badge size="sm" color={booking.status === "Completed" ? "success" : booking.status === "Pending" ? "warning" : "error" }>
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
