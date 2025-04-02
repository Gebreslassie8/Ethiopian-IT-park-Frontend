import React from "react";
import Sidebar from "../Components/Dashboard/Sidebar";
import { User, FileText, BarChart,Layers } from "lucide-react";
import Colors from "../Styles/Colors";
import PropTypes from "prop-types";

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, isMobile }) => {
  const adminMenuItems = [
  
      { name: "Overview", icon: <Layers />, path: "/dashboard/overview" },
      { name: "Users", icon: <User />, path: "/dashboard/users" },
      { name: "Contents", icon: <FileText />, path: "/dashboard/contents" },
      { name: "Analytics", icon: <BarChart />, path: "/dashboard/analytics" },
  
  ];

  const adminSidebarStyles = {
    background: `linear-gradient(to bottom, ${Colors.deepTeal}, ${Colors.deepBlue})`,
  };

  return (
    <Sidebar
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      isMobile={isMobile}
      menuItems={adminMenuItems}
      sidebarStyles={adminSidebarStyles}
    />
  );
};
AdminSidebar.propTypes ={
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen:PropTypes.func.isRequired,
  isMobile:PropTypes.bool.isRequired,
}

export default AdminSidebar;