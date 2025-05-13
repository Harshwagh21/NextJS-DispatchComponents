import { Card } from "./card";
import BarChartCard from "./BarChartCard";
import LineChartCard from "./LineChartCard";
import AreaChartCard from "./AreaChartCard";
import useSWR from 'swr';

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

export default function DashboardCharts({ fleetName = "Zomato Fleet Pune" }) {
    const { data, error, isLoading } = useSWR(
        `http://localhost:5000/api/charts/fleet/${encodeURIComponent(fleetName)}`,
        fetcher
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading charts.</div>;
    if (!data) return <div>No data found.</div>;

    // Helper to get chart by category
    const getChart = (category: string) => data.find((c: any) => c.category === category);

    // Revenue Growth (Bar Chart)
    const revenueGrowth = getChart("Revenue Growth");
    const barData = revenueGrowth
        ? revenueGrowth.data.map((value: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, value }))
        : [];

    // User Engagement (Area Chart)
    const userEngagement = getChart("User Engagement");
    // We'll use 'desktop' as the key, but you can adjust as needed
    const areaChartData = userEngagement
        ? userEngagement.data.map((value: number, i: number) => ({ month: monthsLong[i] || `M${i + 1}`, desktop: value }))
        : [];

    // Daily Active Users (Line Chart)
    const dailyActiveUsers = getChart("Daily Active Users");
    // We'll use 'desktop' as the key, but you can adjust as needed
    const chartData = dailyActiveUsers
        ? dailyActiveUsers.data.map((value: number, i: number) => ({ month: monthsLong[i] || `M${i + 1}`, desktop: value }))
        : [];

    // Conversion Rate (Line Chart)
    const conversionRates = getChart("Conversion Rates");
    const conversionRateData = conversionRates
        ? conversionRates.data.map((rate: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, rate }))
        : [];

    // Monthly Sales (Area Chart)
    const monthlySales = getChart("Monthly Sales");
    const monthlySalesData = monthlySales
        ? monthlySales.data.map((sales: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, sales }))
        : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
            {/* Revenue Growth Bar Chart */}
            <BarChartCard
                data={barData}
                config={barConfig}
                barKey="value"
                title="Revenue Growth"
                description="Month-over-month increase in total platform revenue"
                summary={revenueGrowth?.summary || ""}
            />
            {/* User Engagement Area Chart */}
            <AreaChartCard
                data={areaChartData}
                config={areaChartConfig}
                areaKey="desktop"
                title="User Engagement"
                description="Showing total visitors for the last 6 months"
                summary={userEngagement?.summary || ""}
                footerSubtext="January - June 2024"
            />
            {/* Daily Active Users Line Chart */}
            <LineChartCard
                data={chartData}
                config={chartConfig}
                lineKey="desktop"
                title="Daily Active Users"
                description="January - June 2024"
                summary={dailyActiveUsers?.summary || ""}
            />
            {/* Conversion Rate Line Chart */}
            <LineChartCard
                data={conversionRateData}
                config={conversionRateConfig}
                lineKey="rate"
                title="Conversion Rate"
                description="Conversion rate over the last 6 months"
                summary={conversionRates?.summary || ""}
            />
            {/* Monthly Sales Area Chart */}
            <AreaChartCard
                data={monthlySalesData}
                config={monthlySalesConfig}
                areaKey="sales"
                title="Monthly Sales"
                description="Monthly sales for the last 6 months"
                summary={monthlySales?.summary || ""}
                footerSubtext="Jan - Jun 2024"
            />
        </div>
    );
}
