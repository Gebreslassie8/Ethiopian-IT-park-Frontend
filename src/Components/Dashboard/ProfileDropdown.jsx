import React, { useState } from "react";
import PropTypes from "prop-types";
import { User, Settings, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../Context/ProfileContext";

const ProfileDropdown = ({
  onOpenProfile,
  onOpenNotification,
  onOpenSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profilePictureUpdatedAt } = useProfile();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAction = (callback, fallbackRoute) => {
    setIsOpen(false);
    callback ? callback() : navigate(fallbackRoute);
  };
  const fileName = user?.profile_picture?.split("/").pop();
  const profileImage = fileName
    ? `https://ethiopian-it-park-backend.onrender.com/api/files/profile-picture/${fileName}?t=${profilePictureUpdatedAt}`
    : "/default-avatar.png";

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-2 rounded-full hover:ring-2 hover:ring-gray-200 transition"
      >
        <img
          src={profileImage}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
      </button>

      {isOpen && user && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl p-4 z-50">
          <div className="flex items-center gap-3 border-b pb-3">
            <img
              src={profileImage}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-900">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2">
            <DropdownItem
              icon={<User />}
              label="My Profile"
              onClick={() => handleAction(onOpenProfile)}
            />
            <DropdownItem
              icon={<Settings />}
              label="Settings"
              onClick={() => handleAction(onOpenSettings)}
            />
            <DropdownItem
              icon={<Bell />}
              label="Notifications"
              onClick={() => handleAction(onOpenNotification)}
            />
            <DropdownItem
              icon={<LogOut />}
              label="Log Out"
              onClick={handleLogout}
              isDanger
            />
          </ul>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, label, onClick, isDanger = false }) => (
  <li
    onClick={onClick}
    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${
      isDanger ? "text-red-600 hover:bg-red-100" : "hover:bg-gray-100"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </li>
);

ProfileDropdown.propTypes = {
  onOpenProfile: PropTypes.func,
  onOpenNotification: PropTypes.func,
  onOpenSettings: PropTypes.func,
};

DropdownItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isDanger: PropTypes.bool,
};

export default ProfileDropdown;
