import React, { useState, useRef, useEffect } from "react";
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
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleAction = (callback, fallbackRoute) => {
    setIsOpen(false);
    if (callback) callback();
    else if (fallbackRoute) navigate(fallbackRoute);
  };

  const fileName = user?.profile_picture?.split("/").pop();
  const profileImage = fileName
    ? `https://ethiopian-it-park-backend.onrender.com/api/files/profile-picture/${fileName}?t=${profilePictureUpdatedAt}`
    : "/default-avatar.png";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center p-1 rounded-full hover:ring-2 hover:ring-gray-200 transition"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        <img
          src={profileImage}
          alt="User Avatar"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
        />
      </button>

      {/* Dropdown panel — responsive, mobile-safe */}
      {isOpen && user && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="absolute right-0 mt-2 z-50 bg-white shadow-xl rounded-xl
                       w-[calc(100vw-2rem)] max-w-xs sm:w-64
                       p-3 sm:p-4
                       origin-top-right animate-in fade-in slide-in-from-top-2"
            role="menu"
          >
            {/* Header — user info */}
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
              <img
                src={profileImage}
                alt="User"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  {user.username || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email || ""}
                </p>
              </div>
            </div>

            {/* Menu items */}
            <ul className="space-y-0.5">
              <DropdownItem
                icon={<User size={16} />}
                label="My Profile"
                onClick={() => handleAction(onOpenProfile)}
              />
              <DropdownItem
                icon={<Settings size={16} />}
                label="Settings"
                onClick={() => handleAction(onOpenSettings)}
              />
              <DropdownItem
                icon={<Bell size={16} />}
                label="Notifications"
                onClick={() => handleAction(onOpenNotification)}
              />
              <li className="border-t border-gray-100 my-1" />
              <DropdownItem
                icon={<LogOut size={16} />}
                label="Log Out"
                onClick={handleLogout}
                isDanger
              />
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, label, onClick, isDanger = false }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition ${
        isDanger
          ? "text-red-600 hover:bg-red-50 active:bg-red-100"
          : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
      }`}
      role="menuitem"
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
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