'use client'
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    Store,
    DollarSign,
    HeartPulse,
    CircleDot,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Rider Performance", icon: Users },
    { label: "Assignment & Fulfilment", icon: ClipboardList },
    { label: "Instant & Dark Store", icon: Store },
    { label: "Cost & Pricing", icon: DollarSign },
    { label: "System Health", icon: HeartPulse },
];

function getCurrentTimeHHMM() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export default function Sidebar() {
    const [active, setActive] = useState("Overview");
    const [open, setOpen] = useState(true);
    const [simTime, setSimTime] = useState(getCurrentTimeHHMM());

    useEffect(() => {
        const interval = setInterval(() => {
            setSimTime(getCurrentTimeHHMM());
        }, 60000); // update every minute
        // Update immediately in case the minute just changed
        const timeout = setTimeout(() => setSimTime(getCurrentTimeHHMM()), 1000);
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <aside
            className={`relative flex flex-col h-full bg-background border-r border-border py-6 px-3 ${open ? "w-60" : "w-16"}`}
        >
            {/* Toggle Button */}
            <button
                className="absolute top-1/10 -right-4 z-20 transform -translate-y-1/2 bg-background border border-border rounded-full p-1 shadow hover:bg-muted transition-colors"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? "Close sidebar" : "Open sidebar"}
            >
                {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            {/* Top: Runtime */}
            {open && (
                <div className={`flex flex-col gap-1 mb-8 items-start ml-4`}>
                    <div className="text-4xl font-bold text-foreground">
                        01:02:05
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CircleDot className="w-3 h-3 bg-primary text-primary rounded-full" />
                        <span>Runtime</span>
                    </div>
                </div>
            )}
            {/* Navigation */}
            <nav className={`flex flex-col gap-3 mt-2 ${open ? "items-start ml-4" : "items-center ml-0"}`}>
                {navItems.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        className={`flex items-center ${open ? "gap-3 px-4 w-full" : "px-1.5 w-12"} py-3 rounded-lg transition-colors text-left text-sm font-medium
              ${active === label ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground"}`}
                        onClick={() => setActive(label)}
                    >
                        <Icon className="w-5 h-5 ml-2" />
                        {open && label}
                    </button>
                ))}
            </nav>
            {/* Simulation World Time */}
            {open && (
                <div className={`flex flex-col mt-16 items-start ml-4`}>
                    <div className="text-xs text-muted-foreground">Simulation World Time</div>
                    <div className="text-3xl font-bold text-foreground">{simTime}</div>
                </div>
            )}
        </aside>
    );
} 