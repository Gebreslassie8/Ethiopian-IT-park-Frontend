import React from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import { User, FileText, BarChart, Layers, FileOutput } from "lucide-react";
import Colors from "../Styles/Colors";
import PropTypes from "prop-types";

const SidebarWithRole = ({ role, isSidebarOpen, setIsSidebarOpen, isMobile }) => {
  const sidebarStyles = {
    background: `linear-gradient(to bottom, ${Colors.deepTeal}, ${Colors.deepBlue})`,
  };

  // Dynamic menu items based on role
  const commonItems = [
    { name: "Overview", icon: <Layers />, path: `/${role}/overview` },
    { name: "Contents", icon: <FileText />, path: `/${role}/contents` },
    { name: "Analytics", icon: <BarChart />, path: `/${role}/analytics` },
  ];

  const adminExtras = [
    { name: "Users", icon: <User />, path: `/admin/users` }, // ✅ Uncommented
    { name: "Generate Report", icon: <FileOutput />, path: `/admin/generate-report` },
  ];

  const contentManagerExtras = [
    { name: "Generate Report", icon: <FileOutput />, path: `/content-manager/generate-report` },
  ];

  const menuItems =
    role === "admin"
      ? [...commonItems, ...adminExtras]
      : [...commonItems, ...contentManagerExtras];

  return (
    <Sidebar
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      isMobile={isMobile}
      menuItems={menuItems}
      sidebarStyles={sidebarStyles}
      role={role} // ✅ Make sure to pass role to Sidebar if needed
    />
  );
};

SidebarWithRole.propTypes = {
  role: PropTypes.string.isRequired,
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default SidebarWithRole;