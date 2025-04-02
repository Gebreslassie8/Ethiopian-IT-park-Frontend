import React from "react";
import ContentTable from "../Components/Analytics/ContentTable";
import ActivitySection from "../Components/Analytics/ActivitySection";
import UnderutilizedResourcesTable from "../Components/Analytics/UnderutilizedResourcesTable";
import TimeSpentChart from "../Components/Analytics/TimeSpentChart";
import RetentionRateChart from "../Components/Analytics/RetentionRateChart";

const Analytics = () => {
  return (
    <div className="pr-6">
      <div className="flex flex-wrap gap-6">
        <ContentTable />
        <ActivitySection />
        <UnderutilizedResourcesTable />
        <TimeSpentChart />
        <RetentionRateChart />
      </div>
    </div>
  );
};

export default Analytics;