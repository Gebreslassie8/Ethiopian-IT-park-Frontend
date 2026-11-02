import { useState, useEffect } from "react";
import SidebarWithRole from "../../Dashboard/sidebarWithRole";
import DashboardHeader from "./DashboardHeader";
import MyProfile from "./MyProfile";
import Notification from "./Notification";
import Settings from "./Settings";
import Colors from "../../Styles/Colors";
import { useProfile } from "../../Context/ProfileContext";

export default function DashboardLayout({ role, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { loading } = useProfile();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  return (
    <>
      <div
        className="h-screen flex"
        style={{ backgroundColor: Colors.backgroundColor }}
      >
        <SidebarWithRole
          role={role}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={isMobile}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader
            isMobile={isMobile}
            setIsSidebarOpen={setIsSidebarOpen}
            onProfileClick={() => setShowProfile(true)}
            onNotificationClick={() => setShowNotification(true)}
            onSettingsClick={() => setShowSettings(true)}
          />

          <div
            className="flex-1 overflow-y-auto p-6 relative text-base md:text-xl"
            style={{ color: Colors.smokyGray }}
          >
            {loading ? <p>Loading profile...</p> : children}
          </div>
        </div>
      </div>

      {showProfile && <MyProfile onClose={() => setShowProfile(false)} />}

      {showNotification && (
        <Notification
          type="success"
          message="You have a new message!"
          onClose={() => setShowNotification(false)}
        />
      )}

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}