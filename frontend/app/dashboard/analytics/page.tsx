import React from "react";
import { PieChart } from "lucide-react";
import PortfolioPerformanceChart from "./PortfolioPerformanceChart";

export const metadata = { title: "Analytics – Nestera" };

export default function AnalyticsPage() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-linear-to-b from-[#063d3d] to-[#0a6f6f] flex items-center justify-center text-[#5de0e0]">
          <PieChart size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white m-0">Analytics</h1>
          <p className="text-[#5e8c96] text-sm m-0">
            Portfolio performance and insights
          </p>
        </div>
      </div>

      <PortfolioPerformanceChart />
    </div>
  );
}
