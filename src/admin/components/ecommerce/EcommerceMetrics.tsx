import React from 'react';
import ArrowDownIcon from "../../../assets/icons/arrow-down";
import ArrowUpIcon from "../../../assets/icons/arrow-up";
import BoxIconLine from "../../../assets/icons/box-line";
import GroupIcon from "../../../assets/icons/group";
import PlugInIcon from "../../../assets/icons/plug-in"; 
import Badge from "../ui/badge/Badge";

interface DashboardProps {
    customerCount: number;
    bookingCount: number;
    centerCount: number;
}

const EcommerceMetrics: React.FC<DashboardProps> =({
    customerCount,
    bookingCount,
    centerCount,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Customers
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {customerCount}
                        </h4>
                    </div>
                    {/* <Badge color="success">
                        <ArrowUpIcon />
                        11.01%
                    </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <PlugInIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Service Center
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {centerCount}
                        </h4>
                    </div>

                    {/* <Badge color="error">
                        <ArrowDownIcon />
                        9.05%
                    </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Total Booking
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {bookingCount}
                        </h4>
                    </div>

                    {/* <Badge color="error">
                        <ArrowDownIcon />
                        9.05%
                    </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
}


export default EcommerceMetrics 