"use client";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const legendItems = [
    { label: "Zomato Riders", color: "#ef4444" },
    { label: "Swiggy Riders", color: "#f97316" },
    { label: "Zepto Riders", color: "#a21caf" }
];

export default function LegendDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <div className="fixed top-35 right-8 z-30 flex flex-col items-end" ref={dropdownRef}>
            {/* Dropdown Button - right aligned */}
            <button
                className="flex items-center text-neutral-900 dark:text-white text-base font-semibold bg-transparent border-none shadow-none outline-none  justify-end"
                style={{ minWidth: 100 }}
                onClick={() => setOpen((v) => !v)}
            >
                Legend
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {/* Dropdown Content - appears below, left-aligned */}
            {open && (
                <div className="mt-3 self-start backdrop-blur-[6px] bg-transparent rounded-2xl shadow-lg px-1 py-1 min-w-[150px] max-w-[220px] border border-white/10">
                    <div className="flex flex-col gap-1">
                        {legendItems.map((item, idx) => (
                            <button
                                key={idx}
                                className="flex items-center gap-2 justify-start text-left w-full rounded-lg px-2 py-2 border-none hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-95"
                            >
                                <span
                                    className="left-2 w-4 h-4 rounded-xs border border-white/30"
                                    style={{ backgroundColor: item.color }}
                                ></span>
                                <span className="text-neutral-900 dark:text-white text-sm font-medium drop-shadow-sm">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 