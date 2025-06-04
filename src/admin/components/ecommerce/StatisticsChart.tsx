import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { useEffect, useState } from "react";
import adminClient from "../../../services/adminClient";

export default function StatisticsChart() {
    const [filter, setFilter] = useState('Annually');
    const [salesCount, setSalesCount] = useState([168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112])
    const [month, setMonth] = useState(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
    const options: ApexOptions = {
        legend: {
            show: false, // Hide legend
            position: "top",
            horizontalAlign: "left",
        },
        colors: ["#465FFF", "#9CB9FF"], // Define line colors
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line", // Set the chart type to 'line'
            toolbar: {
                show: false, // Hide chart toolbar
            },
        },
        stroke: {
            curve: "straight", // Define the line style (straight, smooth, or step)
            width: [2, 2], // Line width for each dataset
        },

        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0, // Size of the marker points
            strokeColors: "#fff", // Marker border color
            strokeWidth: 2,
            hover: {
                size: 6, // Marker size on hover
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false, // Hide grid lines on x-axis
                },
            },
            yaxis: {
                lines: {
                    show: true, // Show grid lines on y-axis
                },
            },
        },
        dataLabels: {
            enabled: false, // Disable data labels
        },
        tooltip: {
            enabled: true, // Enable tooltip
            x: {
                format: "dd MMM yyyy", // Format for x-axis tooltip
            },
        },
        xaxis: {
            type: "category", // Category-based x-axis
            categories: month,
            axisBorder: {
                show: false, // Hide x-axis border
            },
            axisTicks: {
                show: false, // Hide x-axis ticks
            },
            tooltip: {
                enabled: false, // Disable tooltip for x-axis points
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px", // Adjust font size for y-axis labels
                    colors: ["#6B7280"], // Color of the labels
                },
            },
            title: {
                text: "", // Remove y-axis title
                style: {
                    fontSize: "0px",
                },
            },
        },
    };

    const series = [
        {
            name: "Booking",
            data: salesCount,
        }
    ];
    const geSalesDetails = async () => {
        await adminClient.get(`/v1/dashboard-sales-count?filter=${filter}`).then((response) => {
            const { success, data } = response.data;
            if (success) {
                setMonth(data.monthLabels);
                setSalesCount(data.monthWiseCount);
            }
        }, (error: any) => {
            console.error(error)
        })
    }

    useEffect(() => {
        geSalesDetails();
    }, [filter])
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Statistics
                    </h3>
                    <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        Target you’ve set for each month
                    </p>
                </div>
                <div className="flex items-start w-full gap-3 sm:justify-end">
                    {/* <ChartTab /> */}
                    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                        <button
                            onClick={() => setFilter("Monthly")}
                            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setFilter("Quarterly")}
                            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white `}
                        >
                            Quarterly
                        </button>
                        <button
                            onClick={() => setFilter("Annually")}
                            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white `}
                        >
                            Annually
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] xl:min-w-full">
                    <Chart options={options} series={series} type="area" height={310} />
                </div>
            </div>
        </div>
    );
}
