'use client'
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/ui/Header";
import ControlPanel from "@/components/ui/ControlPanel";
import Sidebar from "@/components/ui/Sidebar";
import { useDebounce } from "@/hooks/useDebounce";

const DashboardCharts = dynamic(() => import("@/components/ui/DashboardCharts"), { 
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-muted rounded" />
});
const CompareSimulations = dynamic(() => import("@/components/ui/CompareSimulations"), { 
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-muted rounded" />
});

export default function DashboardClient() {
  const [showCompare, setShowCompare] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState("Zomato Fleet Pune");
  const [searchQuery, setSearchQuery] = useState("");
  
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const toggleCompare = useMemo(() => () => setShowCompare(prev => !prev), []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 bg-background">
        <Header />
        <ControlPanel
          onCompareClick={toggleCompare}
          isCompareOpen={showCompare}
          fleet={selectedFleet}
          setFleet={setSelectedFleet}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="flex pt-[128px] min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-128px)]">
          {showCompare ? (
            <CompareSimulations searchQuery={debouncedSearchQuery} setSearchQuery={setSearchQuery} />
          ) : (
            <DashboardCharts fleetName={selectedFleet} searchQuery={debouncedSearchQuery} setSearchQuery={setSearchQuery} />
          )}
        </div>
      </div>
    </>
  );
}

