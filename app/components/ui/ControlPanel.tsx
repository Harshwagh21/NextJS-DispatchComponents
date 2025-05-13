'use client'
import { useRef, useState, useEffect } from "react";
import { Button } from "./button";
import { PanelLeft, ChevronDown, Search } from "lucide-react";

interface ControlPanelProps {
    onCompareClick?: () => void;
    isCompareOpen?: boolean;
    fleet: string;
    setFleet: (fleet: string) => void;
}

export default function ControlPanel({ onCompareClick, isCompareOpen, fleet, setFleet }: ControlPanelProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const fleets = ["Zomato Fleet Mumbai", "Zomato Fleet Pune", "Zomato Fleet Bangalore"];
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <div className="w-full flex items-center justify-between px-6 py-3 border-b border-border">
            {/* Left: Compare Simulations Button */}
            <div>
                <Button
                    className="rounded-full flex items-center gap-2"
                    onClick={onCompareClick}
                >
                    <PanelLeft className="w-5 h-5" />
                    {isCompareOpen ? "Go Back to Stats" : "Compare Simulations"}
                </Button>
            </div>
            {/* Center: Fleet Dropdown styled as pill */}
            <div className="relative flex items-center gap-2 bg-muted rounded-full" ref={dropdownRef}>
                {/* Fleet label pill */}
                <div className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold select-none">
                    Fleet
                </div>
                {/* Fleet name pill (dropdown trigger) */}
                <div
                    className="flex items-center rounded-full bg-accent text-accent-foreground px-4 py-2 cursor-pointer gap-2 select-none min-w-[100px]"
                    onClick={() => setDropdownOpen((open) => !open)}
                    tabIndex={0}
                >
                    <span className="font-semibold">{fleet}</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
                {/* Dropdown menu */}
                {dropdownOpen && (
                    <div className="absolute left-[110px] mt-2 w-64 bg-background border border-border rounded shadow z-10">
                        {fleets.map((f) => (
                            <div
                                key={f}
                                className={`px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground whitespace-nowrap overflow-hidden text-ellipsis ${fleet === f ? 'font-bold' : ''}`}
                                onClick={() => {
                                    setFleet(f);
                                    setDropdownOpen(false);
                                }}
                            >
                                {f}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Right: Search Bar */}
            <div className="flex items-center bg-background border border-border rounded-full px-3 py-1">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent outline-none text-sm w-32"
                />
            </div>
        </div>
    );
}
