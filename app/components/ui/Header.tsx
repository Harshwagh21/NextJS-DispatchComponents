'use client'
import { Map, BarChart2, User, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useEffect, useState } from "react";

export default function Header() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [dark]);

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 bg-background border-b border-border shadow-sm">
            {/* Left: Map, Stats, Dark Mode Toggle */}
            <div className="flex gap-2">
                <span className="rounded-full p-2 hover:bg-primary transition-colors cursor-pointer">
                    <Map className="w-6 h-6" />
                </span>
                <span className="rounded-full p-2 hover:bg-primary transition-colors cursor-pointer">
                    <BarChart2 className="w-6 h-6" />
                </span>
                <button
                    className="rounded-full p-2 hover:bg-primary transition-colors cursor-pointer"
                    onClick={() => setDark((d) => !d)}
                    aria-label="Toggle dark mode"
                >
                    {dark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
            </div>
            {/* Center: App Name */}
            <div className="text-2xl font-bold tracking-widest select-none">DISPATCH</div>
            {/* Right: User name and avatar */}
            <div className="flex items-center gap-3">
                <span className="font-medium text-sm text-right">Harsh</span>
                <Avatar>
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback>
                        <User className="w-5 h-5" />
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
} 