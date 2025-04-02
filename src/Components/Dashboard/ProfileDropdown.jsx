import { useState } from "react";
import { User, Settings, Bell, LogOut } from "lucide-react";
import profilep from "../../assets/profilep.jpg";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <img
          src={profilep}
          alt="Profile"
          className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 md:w-64 lg:w-80 bg-white shadow-lg rounded-xl p-4 z-50">
          {/* Profile Info */}
          <div className="flex items-center space-x-3 border-b pb-3">
            <img
              src={profilep}
              alt="Profile"
              className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900 text-base md:text-lg">Samrawit</p>
              <p className="text-sm md:text-base text-gray-500">samrawit@gmail.com</p>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="mt-3 space-y-2">
            <li className="flex items-center p-2 md:p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
              <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              <span className="ml-3 text-sm md:text-base">My Profile</span>
            </li>
            <li className="flex items-center p-2 md:p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Settings className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              <span className="ml-3 text-sm md:text-base">Settings</span>
            </li>
            <li className="flex items-center p-2 md:p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              <span className="ml-3 text-sm md:text-base">Notifications</span>
            </li>
            <li className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-100 text-red-600 cursor-pointer">
              <LogOut className="w-5 h-5 md:w-6 md:h-6" />
              <span className="ml-3 text-sm md:text-base">Log Out</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;