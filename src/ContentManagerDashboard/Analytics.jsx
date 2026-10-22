// src/pages/ContentManagerAnalytics.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import ActivitySection from "../Components/Analytics/ActivitySection";
import TimeSpentChart from "../Components/Analytics/TimeSpentChart";
import ResourcesTable from "../Components/Analytics/ResourcesTable";

const ContentManagerAnalytics = () => {
  const [activityData, setActivityData] = useState([]);
  const [timeSpentData, setTimeSpentData] = useState([]);
  const [frequentResources, setFrequentResources] = useState([]);
  const [underutilizedResources, setUnderutilizedResources] = useState([]);
  const [activityTotals, setActivityTotals] = useState({ uploads: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContentManagerAnalytics = async () => {
      try {
        const [
          activityRes,
          timeSpentRes,
          frequentRes,
          underutilizedRes,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/monthly`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/time-spent`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/frequently-accessed`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/analytics/underutilized`),
        ]);

        setActivityData(activityRes.data);
        setTimeSpentData(timeSpentRes.data);
        setFrequentResources(frequentRes.data);
        setUnderutilizedResources(underutilizedRes.data);


        const uploads = activityRes.data.reduce((sum, item) => sum + Number(item.uploads), 0);
        const downloads = activityRes.data.reduce((sum, item) => sum + Number(item.downloads), 0);
        setActivityTotals({ uploads, downloads });
      } catch (err) {
        console.error("Error fetching content manager analytics:", err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchContentManagerAnalytics();
  }, []);

  return (
    <div className="px-4 md:px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySection data={activityData} totals={activityTotals} />
        <TimeSpentChart data={timeSpentData} />
        {!loading && !error && (
          <>
            <ResourcesTable
              title="Frequently Accessed Resources"
              data={frequentResources}
            />
            <ResourcesTable
              title="Underutilized Resources"
              data={underutilizedResources}
            />
          </>
        )}
      </div>
      {loading && <p className="mt-4 text-gray-600">Loading analytics...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default ContentManagerAnalytics;
