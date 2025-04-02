import { Menu ,Settings } from "lucide-react";
import { useLocation } from "react-router-dom"; // Import the useLocation hook
import Colors from "../../Styles/Colors";
import profilep from "../../assets/profilep.jpg";
import propTypes from "prop-types";
import ProfileDropdown from "./ProfileDropdown";

const DashboardHeader = ({ isMobile, setIsSidebarOpen }) => {
  const location = useLocation(); // Get the current location for the header title
  const activeTab = location.pathname.split("/").pop();

  return (
    <div className="w-full h-20 bg-white flex items-center px-6 shadow-md">
      {isMobile && (
        <button
          className="mr-4 p-2 rounded-xl"
          style={{ color: Colors.smokyGray,hoverBackgroundColor:Colors.lightTeal }}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
      )}

      <h2
        className="text-2xl md:text-3xl font-semibold"
        style={{ color: Colors.deepAqua }}
      >
        {activeTab}
      </h2>

      <div className="ml-auto flex items-center gap-4">
         {/* Add Settings Icon */}
         <button className="p-2 text-gray-700 hover:text-gray-900">
            <Settings size={24} />
          </button>
          <ProfileDropdown/>
        {/* <img
          src={profilep}
          alt="Profile"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <Button
          type="button"
          label="Log Out"
          icon="LogOut"
          className="my-2 px-4 md:px-6 text-base md:text-lg gap-2 py-2"
        /> */}
      </div>
    </div>
  );
};
DashboardHeader.propTypes = {
  isMobile: propTypes.bool.isRequied,
  setIsSidebarOpen: propTypes.func.isRequied,
};

export default DashboardHeader;
