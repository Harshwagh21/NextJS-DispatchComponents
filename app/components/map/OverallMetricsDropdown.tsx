"use client";
import { useState, useRef } from "react";
import { ChevronDown, TrendingUp, Users, Package, IndianRupee } from "lucide-react";

interface MetricData {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: React.ReactNode;
}

const metrics: MetricData[] = [
    {
        label: "Earnings per hour",
        value: "125",
        change: "+12%",
        trend: "up",
        icon: <IndianRupee className="w-5 h-5" />
    },
    {
        label: "Empty Mile Percentage",
        value: "25%",
        change: "-5%",
        trend: "down",
        icon: <Package className="w-5 h-5" />
    },
    {
        label: "Orders created",
        value: "15,400",
        change: "+8%",
        trend: "up",
        icon: <TrendingUp className="w-5 h-5" />
    },
    {
        label: "Orders accepted",
        value: "98",
        change: "+2%",
        trend: "up",
        icon: <Users className="w-5 h-5" />
    },
    {
        label: "Orders fulfilled",
        value: "97",
        change: "+1%",
        trend: "up",
        icon: <Package className="w-5 h-5" />
    },
    {
        label: "Order Inflow Rate",
        value: "101%",
        change: "+3%",
        trend: "up",
        icon: <TrendingUp className="w-5 h-5" />
    }
];

export default function OverallMetricsDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <div className="fixed top-35 left-8 z-30" ref={dropdownRef}>
            {/* Dropdown Button - simple text only */}
            <button
                className="flex items-center gap-1 text-neutral-900 dark:text-white text-base font-semibold bg-transparent border-none shadow-none outline-none select-none p-0 m-0"
                style={{ minWidth: 140 }}
                onClick={() => setOpen((v) => !v)}
            >
                Overall Metrics
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {/* Dropdown Content */}
            {open && (
                <div className="mt-3 flex flex-col gap-2 select-none">
                    {metrics.map((metric, idx) => (
                        <div
                            key={idx}
                            className="backdrop-blur-[6px] bg-transparent rounded-2xl shadow-lg px-3 py-2 w-[180px] flex flex-col gap-3 border border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-600 dark:text-yellow-300">{metric.icon}</span>
                                <span className="text-2xl font-bold text-neutral-900 dark:text-white drop-shadow-sm">{metric.value}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-neutral-900 dark:text-white/80 drop-shadow-sm">{metric.label}</span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold ${metric.trend === 'up' ? 'text-green-500' :
                                        metric.trend === 'down' ? 'text-red-500' :
                                            'text-gray-400'
                                        }`}>
                                        {metric.change}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 