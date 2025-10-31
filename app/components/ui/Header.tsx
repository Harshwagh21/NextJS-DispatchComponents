'use client'
import { Map, BarChart2, Sun, Moon, Power } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "./button";
import { useState } from "react";
import SigninModal from "@/components/mvpblocks/signin-modal";

interface HeaderProps {
    activePage?: "map" | "barchart2";
}

function getCurrentTheme() {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("dark-mode");
    if (stored === "true") return true;
    if (stored === "false") return false;
    // Default to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function setTheme(isDark: boolean) {
    if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("dark-mode", "true");
    } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("dark-mode", "false");
    }
}

function useTheme() {

    return useSyncExternalStore(
        (cb) => {
            window.addEventListener("storage", cb);
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", cb);
            return () => {
                window.removeEventListener("storage", cb);
                window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", cb);
            };
        },
        getCurrentTheme,
        () => false // Server snapshot - default to light mode
    );
}


export default function Header({ activePage }: HeaderProps) {
    const isDark = useTheme();
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(
        typeof window !== "undefined" && !!localStorage.getItem('token')
    );
    const [username, setUsername] = useState<string | null>(null);

    const toggleDark = () => {
        setTheme(!getCurrentTheme());
        // Force update by dispatching a storage event (triggers useSyncExternalStore)
        window.dispatchEvent(new Event("storage"));
    };

    useEffect(() => {
        setTheme(isDark);
    }, [isDark]);

    useEffect(() => {
        if (loggedIn) {
            const token = localStorage.getItem('token');
            if (token) {
                // Decode token to get userId
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userId = payload.userId;
                // Fetch user info
                fetch(`http://localhost:2001/api/auth/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.username) setUsername(data.username);
                    });
            }
        } else {
            setUsername(null);
        }
    }, [loggedIn]);

    const handleLogout = () => {
        if (window.confirm("Do you want to log off?")) {
            localStorage.removeItem('token');
            setLoggedIn(false);
            window.location.reload();
        }
    };

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 bg-trasnparent relative">
            {/* Left: Map, Stats, Dark Mode Toggle */}
            <div className="flex gap-2">
                {loggedIn && (
                    <>
                        <div className="relative group">
                            <button
                                className={`rounded-full p-2 hover:bg-primary transition-colors cursor-pointer ${activePage === "map" ? "bg-primary text-primary-foreground" : ""}`}
                                onClick={() => router.push("/map")}
                            >
                                <Map className="w-6 h-6" />
                            </button>
                            <div className="absolute left-1/2 -translate-x-1/2 bg-transparent text-popover-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Map
                            </div>
                        </div>
                        <div className="relative group">
                            <button
                                className={`rounded-full p-2 hover:bg-primary transition-colors cursor-pointer ${activePage === "barchart2" ? "bg-primary text-primary-foreground" : ""}`}
                                onClick={() => router.push("/")}
                            >
                                <BarChart2 className="w-6 h-6" />
                            </button>
                            <div className="absolute left-1/2 -translate-x-1/2 bg-transparent text-popover-foreground text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Stats
                            </div>
                        </div>
                    </>
                )}
                <button
                    className="rounded-full p-2 hover:bg-primary transition-colors cursor-pointer"
                    onClick={toggleDark}
                    aria-label="Toggle dark mode"
                >
                    {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
            </div>
            {/* Center: App Name */}
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none">
                <div className="relative h-8 md:h-10 w-56 md:w-72">
                    <Image 
                        src="/Dispatchlogo.png" 
                        alt="Dispatch Logo" 
                        fill
                        className="object-contain dark:invert"
                        priority
                    />
                </div>
            </div>
            {/* Right: User name and avatar with sign-in modal */}
            <div className="flex items-center gap-3">
                <span className="font-medium text-sm text-right select-none">{loggedIn ? username || "..." : "</>"}</span>
                {loggedIn ? (
                    <Button variant="ghost" onClick={handleLogout} title="Log off">
                        <Power className="w-5 h-5 text-red-500" />
                    </Button>
                ) : (
                    <SigninModal />
                )}
            </div>
        </header>
    );
} 