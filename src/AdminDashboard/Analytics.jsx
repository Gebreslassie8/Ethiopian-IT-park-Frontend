// src/pages/Analytics.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import ActivitySection from "../Components/Analytics/ActivitySection";
import ResourcesTable from "../Components/Analytics/ResourcesTable";
import ActiveUsersChart from "../Components/Analytics/ActiveUsers";

const Analytics = () => {
  const [frequentResources, setFrequentResources] = useState([]);
  const [underutilizedResources, setUnderutilizedResources] = useState([]);
  // const [timeSpentData, setTimeSpentData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [activityTotals, setActivityTotals] = useState({ uploads: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [
          frequentRes,
          underutilizedRes,
          // timeSpentRes,
          activityRes,
          activeUsersRes,
        ] = await Promise.all([
          axios.get("http://localhost:3000/api/analytics/frequently-accessed"),
          axios.get("http://localhost:3000/api/analytics/underutilized"),
          // axios.get("http://localhost:3000/api/analytics/time-spent"),
          axios.get("http://localhost:3000/api/analytics/monthly"),
          axios.get("http://localhost:3000/api/analytics/active-users"),
        ]);

        setFrequentResources(frequentRes.data);
        setUnderutilizedResources(underutilizedRes.data);
        // setTimeSpentData(timeSpentRes.data);
        setActivityData(activityRes.data);
        setActiveUsersData(activeUsersRes.data);

        // Calculate totals
        const uploads = activityRes.data.reduce((sum, item) => sum + Number(item.uploads), 0);
        const downloads = activityRes.data.reduce((sum, item) => sum + Number(item.downloads), 0);
        setActivityTotals({ uploads, downloads });
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

 return (
  <div className="pr-6">
    {loading && <p>Loading resources...</p>}
    {error && <p>{error}</p>}

    {!loading && !error && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivitySection data={activityData} totals={activityTotals} />

        <ResourcesTable
          title="Frequently Accessed Resources"
          data={frequentResources}
        />

        <ResourcesTable
          title="Underutilized Resources"
          data={underutilizedResources}
        />

        <ActiveUsersChart data={activeUsersData} />
      </div>
    )}
  </div>
);

};

export default Analytics;
