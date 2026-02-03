import { Menu, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Colors from "../../Styles/Colors";
import ProfileDropdown from "./ProfileDropdown";
import { useProfile } from "../../Context/ProfileContext"; // ✅

const DashboardHeader = ({
  isMobile,
  setIsSidebarOpen,
  onProfileClick,
  onNotificationClick,
  onSettingsClick,
}) => {
  const location = useLocation();
  const activeTab = location.pathname.split("/").pop();
  const { user, profilePictureUpdatedAt } = useProfile(); // ✅

const fileName = user?.profile_picture?.split("/").pop();
const profilePic = fileName
  ? `http://localhost:3000/api/files/profile-picture/${fileName}?t=${profilePictureUpdatedAt}`
  : "/default-avatar.png";


  return (
    <div className="w-full h-20 bg-white flex items-center px-6 shadow-md border-b border-gray-200 z-20">
      {isMobile && (
        <button
          className="mr-4 p-2 rounded-xl"
          style={{ color: Colors.smokyGray }}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
      )}

      <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: Colors.deepAqua }}>
        {activeTab}
      </h2>

      <div className="ml-auto flex items-center gap-4">
        <button className="p-2 text-gray-700 hover:text-gray-900">
          <Settings size={24} />
        </button>

        <ProfileDropdown
          onOpenProfile={onProfileClick}
          onOpenNotification={onNotificationClick}
          onOpenSettings={onSettingsClick}
        />
      </div>
    </div>
  );
};

DashboardHeader.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  onProfileClick: PropTypes.func.isRequired,
  onNotificationClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
};

export default DashboardHeader;
