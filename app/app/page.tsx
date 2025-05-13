'use client'
import { useState } from "react";
import Header from "@/components/ui/Header";
import ControlPanel from "@/components/ui/ControlPanel";
import Sidebar from "@/components/ui/Sidebar";
import DashboardCharts from "@/components/ui/DashboardCharts";
import CompareSimulations from "@/components/ui/CompareSimulations";

export default function Home() {
  const [showCompare, setShowCompare] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState("Zomato Fleet Pune");

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-30 bg-background">
        <Header />
        <ControlPanel
          onCompareClick={() => setShowCompare((prev) => !prev)}
          isCompareOpen={showCompare}
          fleet={selectedFleet}
          setFleet={setSelectedFleet}
        />
      </div>
      <div className="flex pt-[128px] min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-128px)]">
          {showCompare ? (
            <CompareSimulations />
          ) : (
            <DashboardCharts fleetName={selectedFleet} />
          )}
        </div>
      </div>
    </>
  );
}
