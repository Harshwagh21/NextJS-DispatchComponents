import { useState, useEffect } from "react";
import AreaChartCard from "./AreaChartCard";
import BarChartCard from "./BarChartCard";
import LineChartCard from "./LineChartCard";

const chartTypes = [
  { label: "Revenue Growth", value: "Revenue Growth", type: "bar" },
  { label: "User Engagement", value: "User Engagement", type: "area" },
  { label: "Daily Active Users", value: "Daily Active Users", type: "line" },
  { label: "Conversion Rates", value: "Conversion Rates", type: "line" },
  { label: "Monthly Sales", value: "Monthly Sales", type: "area" },
];

const fleets = [
  "Zomato Fleet Mumbai",
  "Zomato Fleet Pune",
  "Zomato Fleet Bangalore"
];

const areaConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
};
const barConfig = {
  value: {
    label: "Value",
    color: "var(--primary)",
  },
};
const lineConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--primary)",
  },
  rate: {
    label: "Conversion Rate",
    color: "var(--primary)",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
};

const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface ChartData {
  category: string;
  data: number[];
  summary: string;
}

export default function CompareSimulations({ fleet = "Zomato Fleet Pune" }) {
  const [selectedFleet, setSelectedFleet] = useState<string>(fleet);
  const [chart1, setChart1] = useState<string>(chartTypes[0].value);
  const [chart2, setChart2] = useState<string>(chartTypes[1].value);
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/charts/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fleet: selectedFleet,
            categories: [chart1, chart2]
          })
        });
        if (!res.ok) {
          setData([]);
          setLoading(false);
          return;
        }
        const result = await res.json();
        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        setData([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedFleet, chart1, chart2]);

  // Helper to get chart data by category
  const getChart = (category: string): ChartData | undefined => data.find((c) => c.category === category);

  function renderChart(chartCategory: string) {
    const chartMeta = chartTypes.find((ct) => ct.value === chartCategory);
    const chart = getChart(chartCategory);
    if (!chart) return <div className="p-4">No data</div>;
    // Map data to chart card format
    let chartData: any[] = [];
    let summary = chart.summary || "";
    if (chartCategory === "Revenue Growth" || chartCategory === "Monthly Sales") {
      chartData = chart.data.map((value: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, value: value, sales: value }));
    } else if (chartCategory === "User Engagement" || chartCategory === "Daily Active Users") {
      chartData = chart.data.map((value: number, i: number) => ({ month: monthsLong[i] || `M${i + 1}`, value: value, desktop: value, visitors: value }));
    } else if (chartCategory === "Conversion Rates") {
      chartData = chart.data.map((value: number, i: number) => ({ month: monthsShort[i] || `M${i + 1}`, rate: value }));
    }
    // Render correct chart type
    if (chartMeta?.type === "bar") {
      return (
        <BarChartCard
          data={chartData}
          config={barConfig}
          barKey="value"
          title={`${chartCategory} - Bar Chart`}
          description="Monthly values"
          summary={summary}
        />
      );
    }
    if (chartMeta?.type === "area") {
      return (
        <AreaChartCard
          data={chartData}
          config={areaConfig}
          areaKey="value"
          title={`${chartCategory} - Area Chart`}
          description="Performance over 6 months"
          summary={summary}
          footerSubtext="Jan - Jun 2024"
        />
      );
    }
    if (chartMeta?.type === "line") {
      // Use 'desktop', 'visitors', or 'rate' as lineKey depending on category
      let lineKey: string = "desktop";
      if (chartCategory === "Daily Active Users") lineKey = "visitors";
      if (chartCategory === "Conversion Rates") lineKey = "rate";
      return (
        <LineChartCard
          data={chartData}
          config={lineConfig}
          lineKey={lineKey}
          title={`${chartCategory} - Line Chart`}
          description="Monthly values"
          summary={summary}
        />
      );
    }
    return null;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex gap-6 mb-2 flex-wrap">
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs text-muted-foreground mb-1">Fleet</label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-2"
            value={selectedFleet}
            onChange={e => setSelectedFleet(e.target.value)}
          >
            {fleets.map((fleetName) => (
              <option key={fleetName} value={fleetName}>{fleetName}</option>
            ))}
          </select>

        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
          <label className="text-xs text-muted-foreground mb-1">Chart 1</label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={chart1}
            onChange={e => setChart1(e.target.value)}
          >
            {chartTypes.map((ct) => (
              <option key={ct.value} value={ct.value} disabled={ct.value === chart2}>{ct.label}</option>
            ))}
          </select>
          <label className="text-xs text-muted-foreground mb-1">Chart 2</label>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            value={chart2}
            onChange={e => setChart2(e.target.value)}
          >
            {chartTypes.map((ct) => (
              <option key={ct.value} value={ct.value} disabled={ct.value === chart1}>{ct.label}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderChart(chart1)}
          {renderChart(chart2)}
        </div>
      )}
      <div className="mt-8 p-6 rounded-xl bg-muted text-muted-foreground">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Comparison Summary</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Charts are compared for <b>{selectedFleet}</b> fleet.</li>
          <li>Chart 1: <b>{chart1}</b>, Chart 2: <b>{chart2}</b>.</li>
          <li>Summaries: <b>{getChart(chart1)?.summary || "-"}</b> vs <b>{getChart(chart2)?.summary || "-"}</b></li>
        </ul>
      </div>
    </div>
  );
} 