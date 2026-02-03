import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../Components/Dashboard/DashboardLayout";
import Overview from "./Overview";
import Users from "./Users";
import Contents from "./Contents";
import Analytics from "./Analytics";
import GenerateReport from "./GenerateReport";
export default function Dashboard() {
  return (
    <DashboardLayout role="admin">
      <Routes>
        <Route path="/" element={<Navigate to="overview" />} />
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="contents" element={<Contents />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="generate-report" element={<GenerateReport />} />

      </Routes>
    </DashboardLayout>
  );
}
