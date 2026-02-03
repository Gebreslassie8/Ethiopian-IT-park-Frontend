import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import ContentManagerOverview from "./ContentManagerOverview";
import ContentManagerContents from "./Contents";
import ContentManagerAnalytics from "./Analytics";
import UpcomingEvent from "../../../new/UpcomingEvent";
import ContentManagerReport from "./ContentManagerReport";


export default function CMDashboard() {
  return (
    <DashboardLayout role="content-manager">
      <Routes>
        <Route path="/" element={<Navigate to="overview" />} />
        <Route path="overview" element={<ContentManagerOverview />} />
        <Route path="contents" element={<ContentManagerContents />} />
        <Route path="analytics" element={<ContentManagerAnalytics />} />
        <Route path="events" element={<UpcomingEvent />} />
        <Route path="generate-report" element={<ContentManagerReport />} /> 

      </Routes>
    </DashboardLayout>
  );
}
