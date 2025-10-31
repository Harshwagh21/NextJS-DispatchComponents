"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/ui/Header";
import ControlPanel from "@/components/ui/ControlPanel";
import OverallMetricsDropdown from "@/components/map/OverallMetricsDropdown";
import LegendDropdown from "@/components/map/LegendDropdown";
import TimelineScrubber from "@/components/map/TimelineScrubber";

const DARK_MAP_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"; // CartoDB Dark Matter
const LIGHT_MAP_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import("@/components/map/MapComponent"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-muted animate-pulse" />
});

export default function MapPage() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const [selectedFleet, setSelectedFleet] = useState("Zomato Fleet Pune");
    const [currentTileUrl, setCurrentTileUrl] = useState(DARK_MAP_URL);
    const [mapCenter, setMapCenter] = useState<[number, number]>([18.5204, 73.8567]); // Default Pune
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (typeof window === "undefined") return;
        const updateMapTheme = () => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            setCurrentTileUrl(isDarkMode ? DARK_MAP_URL : LIGHT_MAP_URL);
        };
        updateMapTheme();
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateMapTheme();
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => {
            observer.disconnect();
        };
    }, []);

    // Fetch fleet location when selectedFleet changes
    useEffect(() => {
        if (!mounted) return;
        async function fetchFleetLocation() {
            try {
                const res = await fetch(`/api/charts/fleet/${encodeURIComponent(selectedFleet)}`);
                if (!res.ok) throw new Error('Not found');
                const data = await res.json();
                if (data.location && typeof data.location.lat === 'number' && typeof data.location.lng === 'number') {
                    setMapCenter([data.location.lat, data.location.lng]);
                }
            } catch {
                // fallback to Bangalore
                setMapCenter([12.9716, 77.5946]);
            }
        }
        fetchFleetLocation();
    }, [selectedFleet, mounted]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 w-screen h-screen bg-transparent z-0 map-page">
            {/* Header and ControlPanel */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-transparent">
                <Header activePage="map" />
                <ControlPanel
                    fleet={selectedFleet}
                    setFleet={setSelectedFleet}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>
            {/* Map Area */}
            <div className="absolute inset-0 w-full h-full">
                <DynamicMap
                    center={mapCenter}
                    tileUrl={currentTileUrl}
                    attribution={MAP_ATTRIBUTION}
                />
                {/* Vignette overlay for pleasant UI (sides only) */}
                <div className="pointer-events-none absolute top-0 left-0 w-full h-full z-10">
                    <div className="w-full h-full bg-linear-to-r from-black/20 via-transparent to-black/20" />
                    <div className="w-full h-full bg-linear-to-t from-black via-transparent to-black/15" />
                </div>

                <OverallMetricsDropdown />
                <LegendDropdown />

                {/* Timeline Scrubber (fixed at bottom) */}
                <TimelineScrubber />

            </div>
        </div>
    );
} 