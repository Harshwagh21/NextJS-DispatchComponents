'use client'
import { useRef, useState, useEffect } from "react";
import { Button } from "./button";
import { PanelLeft, ChevronDown, Search } from "lucide-react";

interface ControlPanelProps {
    onCompareClick?: () => void;
    isCompareOpen?: boolean;
    fleet: string;
    setFleet: (fleet: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function ControlPanel({ onCompareClick, isCompareOpen, fleet, setFleet, searchQuery, setSearchQuery }: ControlPanelProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [fleets, setFleets] = useState<string[]>([]);
    const [loadingFleets, setLoadingFleets] = useState(false);
    const [error, setError] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (typeof window === "undefined") return;
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

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            setFleets([]);
            return;
        }
        setLoadingFleets(true);
        setError("");
        fetch("http://localhost:2001/api/charts/fleets", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to load fleets: ${res.status} ${res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setFleets(data.map(f => f.name));
                    if (data.length > 0 && !fleet) setFleet(data[0].name);
                } else {
                    setError("Failed to load fleets: Invalid response format");
                }
            })
            .catch((err) => {
                console.error("Error loading fleets:", err);
                setError(err.message || "Failed to load fleets");
            })
            .finally(() => setLoadingFleets(false));
    }, [fleet, setFleet]);

    return (
        <div className="w-full flex items-center justify-between px-6 py-3 border-b border-border relative">
            {/* Left: Compare Simulations Button */}
            <div className="flex-shrink-0">
                <Button
                    className="rounded-full flex items-center gap-2 px-4 py-1 text-sm text-black"
                    onClick={onCompareClick}
                >
                    <PanelLeft className="w-4 h-4" />
                    {isCompareOpen ? "Go Back to Stats" : "Compare Simulations"}
                </Button>
            </div>
            {/* Center: Fleet Dropdown styled as pill */}
            {!isCompareOpen && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-background rounded-full ml-6 border border-black/10" ref={dropdownRef}>
                    {/* Fleet label pill */}
                    <div className="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-sm font-semibold select-none">
                        Fleet
                    </div>
                    {/* Fleet name pill (dropdown trigger) */}
                    <div
                        className="flex items-center text-sm rounded-full bg-background text-accent-foreground px-4 py-1 cursor-pointer gap-2 select-none min-w-[100px]"
                        onClick={() => setDropdownOpen((open) => !open)}
                        tabIndex={0}
                    >
                        <span className="font-semibold">{fleet}</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <div className="absolute left-[40px] top-[25px] mt-2 w-54 bg-background border border-border rounded-md shadow z-10">
                            {typeof window === "undefined" || !localStorage.getItem("token") ? (
                                <div className="px-4 py-2 text-sm text-muted-foreground">Please log in to select a fleet.</div>
                            ) : loadingFleets ? (
                                <div className="px-4 py-2 text-sm text-muted-foreground">Loading fleets...</div>
                            ) : error ? (
                                <div className="px-4 py-2 text-sm text-red-500">{error}</div>
                            ) : (
                                fleets.map((f) => (
                                    <div
                                        key={f}
                                        className={`px-4 py-1.5 cursor-pointer hover:rounded-md hover:bg-primary hover:text-primary-foreground text-sm whitespace-nowrap overflow-hidden text-ellipsis ${fleet === f ? 'font-bold' : ''}`}
                                        onClick={() => {
                                            setFleet(f);
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        {f}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
            {/* Right: Search Bar */}
            <div className="flex items-center bg-dark rounded-full px-5 py-1.5 bg-card/10 backdrop-blur-[4px] border border-border/64 ">
                <Search className="w-4 h-4 text-foreground mr-2" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="outline-none text-sm w-32"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
}
