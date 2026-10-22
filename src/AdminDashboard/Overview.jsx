import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, FileText, CloudUpload, UserPlus } from "lucide-react";
import OverviewLayout from "../Dashboard/OverviewLayout";
import UserGrowthChart from "../Components/Overview/UserGrowthChart";

const statCardsConfig = [
  { id: "total-users", title: "Total Users", icon: User, bgColor: "bg-teal-600" },
  { id: "total-content", title: "Total Content", icon: FileText, bgColor: "bg-yellow-600" },
  { id: "new-uploads", title: "New Uploads", icon: CloudUpload, bgColor: "bg-blue-600" },
  { id: "new-users", title: "New Users", icon: UserPlus, bgColor: "bg-green-600" },
];

const Overview = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentContents, setRecentContents] = useState([]);

 useEffect(() => {
  const fetchOverview = async () => {
    const [summaryRes, recentRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_URL}/api/overview/summary`),
      axios.get(`${import.meta.env.VITE_API_URL}/api/overview/recent`),
    ]);

    const summaryStats = statCardsConfig.map((config) => {
      const change = summaryRes.data[`${config.id}Change`];
      let changeText = summaryRes.data[`${config.id}ChangeText`];
      let positive = change > 0;

      // Define "No Change" text if change is zero
      if (change === 0) {
        changeText = "No Change";
        positive = false; // or true, depending on how you want to handle zero change
      }

      return {
        ...config,
        value: summaryRes.data[config.id],
        changeText,
        positive,
      };
    });

    setStats(summaryStats);
    setChartData(summaryRes.data.userGrowth);
    setRecentContents(recentRes.data);
  };

  fetchOverview();
}, []);

  return (
    <OverviewLayout
      stats={stats}
      ChartComponent={UserGrowthChart}
      chartData={chartData}
      recentContents={recentContents}
    />
  );
};

export default Overview;
