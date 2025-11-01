import { useState, useEffect, useRef } from "react";
import type React from "react";
import AreaChartCard from "@/components/charts/AreaChartCard";
import BarChartCard from "@/components/charts/BarChartCard";
import LineChartCard from "@/components/charts/LineChartCard";
import { ChevronDown } from "lucide-react";

const chartTypes = [
  { label: "Revenue Growth", value: "Revenue Growth", type: "bar" },
  { label: "Order Volume", value: "Order Volume", type: "area" },
  { label: "Average Delivery Time", value: "Average Delivery Time", type: "line" },
  { label: "Customer Satisfaction", value: "Customer Satisfaction", type: "line" },
  { label: "Fleet Utilization", value: "Fleet Utilization", type: "area" },
  { label: "Driver Retention", value: "Driver Retention", type: "line" },
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

interface CompareSimulationsProps {
  fleet?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function CompareSimulations({ fleet = "Zomato Fleet Pune", searchQuery }: CompareSimulationsProps) {
  // Two fleets for comparison
  const [selectedFleet1, setSelectedFleet1] = useState<string>(fleet);
  const [selectedFleet2, setSelectedFleet2] = useState<string>("");
  const [data1, setData1] = useState<ChartData[]>([]);
  const [data2, setData2] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [fleets, setFleets] = useState<string[]>([]);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const dropdownRef2 = useRef<HTMLDivElement>(null);

  // Fetch fleets from API
  useEffect(() => {
    fetch(`/api/charts/fleets`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const fleetNames = data.map(f => f.name);
          setFleets(fleetNames);
          if (fleetNames.length > 0 && !selectedFleet2) {
            const otherFleet = fleetNames.find(f => f !== fleet) || fleetNames[1] || fleetNames[0];
            setSelectedFleet2(otherFleet);
          }
        }
      })
      .catch(() => {});
  }, [fleet, selectedFleet2]);

  useEffect(() => {
    if (!dropdownOpen1 && !dropdownOpen2) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target as Node)) {
        setDropdownOpen1(false);
      }
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target as Node)) {
        setDropdownOpen2(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen1, dropdownOpen2]);

  useEffect(() => {
    const fetchFleetData = async (fleetName: string): Promise<ChartData[]> => {
      try {
        const res = await fetch(`/api/charts/fleet/${encodeURIComponent(fleetName)}`);
        if (!res.ok) return [];
        const result = await res.json();
        return Array.isArray(result.charts) ? result.charts : [];
      } catch {
        return [];
      }
    };
    setLoading(true);
    Promise.all([fetchFleetData(selectedFleet1), fetchFleetData(selectedFleet2)])
      .then(([d1, d2]) => { setData1(d1); setData2(d2); })
      .finally(() => setLoading(false));
  }, [selectedFleet1, selectedFleet2]);

  const getChart = (data: ChartData[], category: string): ChartData | undefined => 
    data.find((c) => c.category === category);

  const filteredChartTypes = !searchQuery
    ? chartTypes
    : chartTypes.filter(ct =>
      ct.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ct.value.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const transformChartData = (category: string, data: number[]) => {
    const useLongMonths = ["Order Volume", "Average Delivery Time"].includes(category);
    const months = useLongMonths ? monthsLong : monthsShort;
    const base = data.map((value, i) => ({ month: months[i] || `M${i + 1}`, value }));
    
    if (category === "Order Volume") {
      return base.map(({ month, value }) => ({ month, value, desktop: value, visitors: value }));
    }
    if (category === "Average Delivery Time") {
      return base.map(({ month, value }) => ({ month, desktop: value, visitors: value }));
    }
    if (["Customer Satisfaction", "Driver Retention"].includes(category)) {
      return base.map(({ month, value }) => ({ month, rate: value }));
    }
    return base.map(({ month, value }) => ({ month, value, sales: value }));
  };

  const renderChart = (chartCategory: string, data: ChartData[]) => {
    const chartMeta = chartTypes.find((ct) => ct.value === chartCategory);
    const chart = getChart(data, chartCategory);
    if (!chart || !chartMeta) return <div className="p-4">No data</div>;
    
    const chartData = transformChartData(chartCategory, chart.data);
    const summary = chart.summary || "";
    const commonProps = { title: chartCategory, summary };
    
    if (chartMeta.type === "bar") {
      return <BarChartCard data={chartData} config={barConfig} barKey="value" description="Monthly values" {...commonProps} />;
    }
    if (chartMeta.type === "area") {
      return <AreaChartCard data={chartData} config={areaConfig} areaKey="value" description="Performance over 7 months" footerSubtext="Jan - Jul 2024" {...commonProps} />;
    }
    const lineKey = ["Customer Satisfaction", "Driver Retention"].includes(chartCategory) ? "rate" : "desktop";
    return <LineChartCard data={chartData} config={lineConfig} lineKey={lineKey} description="Monthly values" {...commonProps} />;
  };

  // Fleet pill dropdown component
  interface FleetDropdownProps {
    label: string;
    selected: string;
    setSelected: (fleet: string) => void;
    dropdownOpen: boolean;
    setDropdownOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    excludeFleet: string;
    fleetsList: string[];
  }
  
  const FleetDropdown = ({ label, selected, setSelected, dropdownOpen, setDropdownOpen, dropdownRef, excludeFleet, fleetsList }: FleetDropdownProps) => {
    const availableFleets = fleetsList.filter(f => f !== excludeFleet);
    return (
      <div className="relative flex items-center gap-2 bg-muted rounded-full" ref={dropdownRef}>
        <div className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold select-none">
          {label}
        </div>
        <div
          className="flex items-center rounded-full bg-accent text-accent-foreground px-4 py-2 cursor-pointer gap-2 select-none min-w-[100px]"
          onClick={() => setDropdownOpen(prev => !prev)}
          tabIndex={0}
        >
          <span className="font-semibold">{selected}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        {dropdownOpen && (
          <div className="absolute left-[110px] mt-2 w-64 bg-background border border-border rounded shadow z-10">
            {availableFleets.length === 0 ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">Loading fleets...</div>
            ) : (
              availableFleets.map(f => (
                <div
                  key={f}
                  className={`px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground whitespace-nowrap overflow-hidden text-ellipsis ${selected === f ? 'font-bold' : ''}`}
                  onClick={() => { setSelected(f); setDropdownOpen(false); }}
                >
                  {f}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Fleet selection pills */}
      <div className="flex gap-6 mb-2 flex-wrap justify-center items-center">
        <FleetDropdown
          label="Fleet 1"
          selected={selectedFleet1}
          setSelected={setSelectedFleet1}
          dropdownOpen={dropdownOpen1}
          setDropdownOpen={setDropdownOpen1}
          dropdownRef={dropdownRef1}
          excludeFleet={selectedFleet2}
          fleetsList={fleets}
        />
        <FleetDropdown
          label="Fleet 2"
          selected={selectedFleet2}
          setSelected={setSelectedFleet2}
          dropdownOpen={dropdownOpen2}
          setDropdownOpen={setDropdownOpen2}
          dropdownRef={dropdownRef2}
          excludeFleet={selectedFleet1}
          fleetsList={fleets}
        />
      </div>
      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : (
        <div className="w-full">
          {/* Fleet labels */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
            {/* Fleet 1 label spans 2 columns */}
            <div className="col-span-1 md:col-span-2 text-center text-md font-semibold">
              {selectedFleet1}
            </div>
            {/* Fleet 2 label spans 2 columns */}
            <div className="col-span-1 md:col-span-2 text-center text-md font-semibold">
              {selectedFleet2}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...filteredChartTypes.map((ct) => ({ ...ct, fleet: 1 })), ...filteredChartTypes.map((ct) => ({ ...ct, fleet: 2 }))].map(({ value, fleet }) => (
              <div key={`${value}-fleet${fleet}`} className="w-full max-w-md mx-auto">
                {renderChart(value, fleet === 1 ? data1 : data2)}
              </div>
            ))}
          </div>
        </div>

      )}
      <div className="mt-8 p-6 rounded-xl bg-muted text-muted-foreground">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Comparison Summary</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Comparing <b>{selectedFleet1}</b> and <b>{selectedFleet2}</b> fleets.</li>
          {filteredChartTypes.map((ct) => (
            <li key={ct.value}>
              <b>{ct.label}:</b> {getChart(data1, ct.value)?.summary || "-"} vs {getChart(data2, ct.value)?.summary || "-"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 