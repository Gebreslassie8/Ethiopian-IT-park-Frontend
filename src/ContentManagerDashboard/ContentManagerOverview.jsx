import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, CloudUpload, Eye, Download } from "lucide-react";
import OverviewLayout from "../Dashboard/OverviewLayout";
import ContentGrowthChart from "../Components/Overview/ContentGrowthChart";

const statCardsConfig = [
  { id: "totalContent", title: "Total Contents", icon: FileText, bgColor: "bg-teal-600" },
  { id: "totalViews", title: "Total Views", icon: Eye, bgColor: "bg-yellow-600" },
  { id: "newUploads", title: "New Uploads", icon: CloudUpload, bgColor: "bg-blue-600" },
  { id: "totalDownloads", title: "Total Downloads", icon: Download, bgColor: "bg-green-600" },
];

const ContentManagerOverview = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentContents, setRecentContents] = useState([]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/content-manager/summary");
        const summaryStats = statCardsConfig.map((config) => {
          const changeValue = res.data[`${config.id}Change`];
          let changeText = res.data[`${config.id}ChangeText`] || "No change last month";

          // Define "No Change" text if changeValue is zero
          if (changeValue === 0) {
            changeText = "No Change";
          }

          return {
            ...config,
            value: res.data[config.id]?.toLocaleString() || "-",
            changeText,
            positive: typeof changeValue === "number" ? changeValue > 0 : false,
          };
        });
        setStats(summaryStats);
        setChartData(res.data.contentGrowth || []);
        setRecentContents(res.data.recentContents || []);
      } catch (error) {
        console.error("Failed to fetch content manager overview:", error);
      }
    };
    fetchOverview();
  }, []);

  return (
    <OverviewLayout
      stats={stats}
      ChartComponent={ContentGrowthChart}
      chartData={chartData}
      recentContents={recentContents}
    />
  );
};

export default ContentManagerOverview;