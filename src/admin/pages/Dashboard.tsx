import React, { useEffect, useState } from 'react';
import { getAllCounts } from '../../services/adminService';
import EcommerceMetrics from "../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../components/ecommerce/StatisticsChart";
import RecentOrders from "../components/ecommerce/RecentOrders";

const Dashboard: React.FC = () => {
    const [moduleCount, setModuleCount] = useState({
        totalBooking: 0,
        sctiveServiceCenter: 0,
        totalCustomer: 0,
        pendingBooking: 0
    })
    const getAllModuleCount = async () => {
        await getAllCounts().then((response) => {
            const { success, data } = response;
            if (success) {
                setModuleCount(data);
            }
        }, (error: any) => {
            console.error(error)
        })
    }

    useEffect(() => {
        getAllModuleCount();
    }, [])
    return (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12">
                <EcommerceMetrics
                    customerCount={moduleCount.totalCustomer}
                    bookingCount={moduleCount.totalBooking}
                    centerCount={moduleCount.sctiveServiceCenter}
                />
            </div>

            <div className="col-span-12">
                <MonthlySalesChart /> 
            </div>
            
            <div className="col-span-12">
                <StatisticsChart />
            </div>

            <div className="col-span-12">
                <RecentOrders />
            </div>

        </div>
    );
};

export default Dashboard; 