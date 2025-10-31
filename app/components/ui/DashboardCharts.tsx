import BarChartCard from "../charts/BarChartCard";
import LineChartCard from "../charts/LineChartCard";
import AreaChartCard from "../charts/AreaChartCard";
import useSWR from 'swr';
import { useState } from "react";
import ChartDialog from "./ChartDialog";

const fetcher = (url: string) => fetch(url).then(res => res.json());

// For mapping index to month names
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const barConfig = {
    value: {
        label: "Value",
        color: "hsl(var(--chart-1))",
    },
};

const areaChartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
};

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
};

const conversionRateConfig = {
    rate: {
        label: "Conversion Rate",
        color: "hsl(var(--chart-3))",
    },
};

const monthlySalesConfig = {
    sales: {
        label: "Sales",
        color: "hsl(var(--chart-4))",
    },
};

interface DashboardChartsProps {
    fleetName?: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

interface ChartItem {
    category: string;
    data: number[];
    summary?: string;
}

export default function DashboardCharts({ fleetName = "Zomato Fleet Pune", searchQuery }: DashboardChartsProps) {
    const { data, error, isLoading } = useSWR(
        `http://localhost:2001/api/charts/fleet/${encodeURIComponent(fleetName)}`,
        fetcher
    );

    const [openChart, setOpenChart] = useState<null | string>(null);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading charts.</div>;
    if (!data || !Array.isArray(data.charts)) return <div>No data found.</div>;

    // Helper to get chart by category
    const getChart = (category: string): ChartItem | undefined => data.charts.find((c: ChartItem) => c.category === category);

    // Revenue Growth (Bar Chart)
    const revenueGrowth = getChart("Revenue Growth");
    const barData = revenueGrowth
        ? revenueGrowth.data.map((value: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, value }))
        : [];

    // Order Volume (Area Chart)
    const orderVolume = getChart("Order Volume");
    const areaChartData = orderVolume
        ? orderVolume.data.map((value: number, i: number) => ({ month: monthsLong[i] || `M${i + 1}`, desktop: value }))
        : [];

    // Average Delivery Time (Line Chart)
    const deliveryTime = getChart("Average Delivery Time");
    const chartData = deliveryTime
        ? deliveryTime.data.map((value: number, i: number) => ({ month: monthsLong[i] || `M${i + 1}`, desktop: value }))
        : [];

    // Customer Satisfaction (Line Chart)
    const customerSatisfaction = getChart("Customer Satisfaction");
    const conversionRateData = customerSatisfaction
        ? customerSatisfaction.data.map((rate: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, rate }))
        : [];

    // Fleet Utilization (Area Chart)
    const fleetUtilization = getChart("Fleet Utilization");
    const monthlySalesData = fleetUtilization
        ? fleetUtilization.data.map((sales: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, sales }))
        : [];

    // Driver Retention (Line Chart)
    const driverRetention = getChart("Driver Retention");
    const driverRetentionData = driverRetention
        ? driverRetention.data.map((value: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, rate: value }))
        : [];

    // Chart definitions for filtering
    const charts = [
        {
            key: "bar",
            title: "Revenue Growth",
            trigger: (
                <BarChartCard
                    data={barData}
                    config={barConfig}
                    barKey="value"
                    title="Revenue Growth"
                    description="Month-by-month increase in total platform revenue"
                    summary={revenueGrowth?.summary || ""}
                    showFooter={false}
                />
            ),
            modal: (
                <BarChartCard
                    data={barData}
                    config={barConfig}
                    barKey="value"
                    title="Revenue Growth"
                    description="Month-over-month increase in total platform revenue"
                    summary={revenueGrowth?.summary || ""}
                />
            )
        },
        {
            key: "area",
            title: "Order Volume",
            trigger: (
                <AreaChartCard
                    data={areaChartData}
                    config={areaChartConfig}
                    areaKey="desktop"
                    title="Order Volume"
                    description="Total orders over the last 7 months"
                    summary={orderVolume?.summary || ""}
                    footerSubtext="January - July 2024"
                    showFooter={false}
                />
            ),
            modal: (
                <AreaChartCard
                    data={areaChartData}
                    config={areaChartConfig}
                    areaKey="desktop"
                    title="Order Volume"
                    description="Total orders over the last 7 months"
                    summary={orderVolume?.summary || ""}
                    footerSubtext="January - July 2024"
                />
            )
        },
        {
            key: "line",
            title: "Average Delivery Time",
            trigger: (
                <LineChartCard
                    data={chartData}
                    config={chartConfig}
                    lineKey="desktop"
                    title="Average Delivery Time"
                    description="Delivery time in minutes (lower is better)"
                    summary={deliveryTime?.summary || ""}
                    showFooter={false}
                />
            ),
            modal: (
                <LineChartCard
                    data={chartData}
                    config={chartConfig}
                    lineKey="desktop"
                    title="Average Delivery Time"
                    description="Delivery time in minutes (lower is better)"
                    summary={deliveryTime?.summary || ""}
                />
            )
        },
        {
            key: "conversion",
            title: "Customer Satisfaction",
            trigger: (
                <LineChartCard
                    data={conversionRateData}
                    config={conversionRateConfig}
                    lineKey="rate"
                    title="Customer Satisfaction"
                    description="Customer satisfaction rating (out of 5 stars)"
                    summary={customerSatisfaction?.summary || ""}
                    showFooter={false}
                />
            ),
            modal: (
                <LineChartCard
                    data={conversionRateData}
                    config={conversionRateConfig}
                    lineKey="rate"
                    title="Customer Satisfaction"
                    description="Customer satisfaction rating (out of 5 stars)"
                    summary={customerSatisfaction?.summary || ""}
                />
            )
        },
        {
            key: "sales",
            title: "Fleet Utilization",
            trigger: (
                <AreaChartCard
                    data={monthlySalesData}
                    config={monthlySalesConfig}
                    areaKey="sales"
                    title="Fleet Utilization"
                    description="Percentage of fleet capacity utilized"
                    summary={fleetUtilization?.summary || ""}
                    footerSubtext="Jan - Jul 2024"
                    showFooter={false}
                />
            ),
            modal: (
                <AreaChartCard
                    data={monthlySalesData}
                    config={monthlySalesConfig}
                    areaKey="sales"
                    title="Fleet Utilization"
                    description="Percentage of fleet capacity utilized"
                    summary={fleetUtilization?.summary || ""}
                    footerSubtext="Jan - Jul 2024"
                />
            )
        },
        {
            key: "retention",
            title: "Driver Retention",
            trigger: (
                <LineChartCard
                    data={driverRetentionData}
                    config={conversionRateConfig}
                    lineKey="rate"
                    title="Driver Retention"
                    description="Driver retention rate percentage"
                    summary={driverRetention?.summary || ""}
                    showFooter={false}
                />
            ),
            modal: (
                <LineChartCard
                    data={driverRetentionData}
                    config={conversionRateConfig}
                    lineKey="rate"
                    title="Driver Retention"
                    description="Driver retention rate percentage"
                    summary={driverRetention?.summary || ""}
                />
            )
        }
    ];
    const filteredCharts = !searchQuery ? charts : charts.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {filteredCharts.map(chart => (
                <ChartDialog
                    key={chart.key}
                    open={openChart === chart.key}
                    onOpenChange={open => setOpenChart(open ? chart.key : null)}
                    trigger={<div onClick={() => setOpenChart(chart.key)}>{chart.trigger}</div>}
                    title={chart.title}
                >
                    {chart.modal}
                </ChartDialog>
            ))}
        </div>
    );
}
