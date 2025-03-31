import { Menu, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom"; // Import the useLocation hook
import Colors from "../../Styles/Colors";
import profilep from "../../assets/profilep.jpg";
import Button from "../Button/ReusableButton";

const DashboardHeader = ({ isMobile, setIsSidebarOpen }) => {
  const location = useLocation(); // Get the current location for the header title
  const activeTab = location.pathname.split("/").pop();

  return (
    <div className="w-full h-20 bg-white flex items-center px-6 shadow-md">
      {isMobile && (
        <button
          className="mr-4 p-2 hover:bg-gray-200 rounded-xl"
          style={{ color: Colors.smokyGray }}
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
        <img
          src={profilep}
          alt="Profile"
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        {/* <Button
          type="button"
          label="Log Out"
          icon="LogOut"
          className="my-2 px-4 md:px-6 text-base md:text-lg gap-2 py-2"
        /> */}
      </div>
    </div>
  );
};

export default DashboardHeader;
