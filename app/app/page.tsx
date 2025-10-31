'use client'
import { useEffect, useState } from "react";
import Header from "@/components/ui/Header";
import ControlPanel from "@/components/ui/ControlPanel";
import Sidebar from "@/components/ui/Sidebar";
import DashboardCharts from "@/components/ui/DashboardCharts";
import CompareSimulations from "@/components/ui/CompareSimulations";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const [showCompare, setShowCompare] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState("Zomato Fleet Pune");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    setMounted(true);
  }, []);

  const token = mounted ? localStorage.getItem("token") : null;

  if (!mounted) {
    return null;
  }

  if (!token) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg text-muted-foreground">Please log in to see data.</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 bg-background">
        <Header />
        <ControlPanel
          onCompareClick={() => setShowCompare((prev) => !prev)}
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
