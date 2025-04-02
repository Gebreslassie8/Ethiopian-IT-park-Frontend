import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import DashboardHeader from "../Components/Dashboard/DashboardHeader";
import Overview from "./Overview";
import Users from "./Users";
import Contents from "./Contents";
import Analytics from "./Analytics";
import Settings from "./Settings";
import Colors from "../Styles/Colors";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex" style={{ backgroundColor: Colors.backgroundColor }}>
      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isMobile={isMobile} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader isMobile={isMobile} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Routing inside Dashboard */}
        <div className="flex-1 overflow-y-auto p-6 text-base md:text-xl" style={{ color: Colors.smokyGray }}>
          <Routes>
            <Route path="/" element={<Navigate to="overview" />} />
            <Route path="overview" element={<Overview />} />
            <Route path="users" element={<Users />} />
            <Route path="contents" element={<Contents />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
