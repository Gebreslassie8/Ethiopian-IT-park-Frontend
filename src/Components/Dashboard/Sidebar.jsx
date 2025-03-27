import { NavLink } from "react-router-dom";
import {
  User,
  FileText,
  BarChart,
  Settings,
  Layers,
  Menu,
} from "lucide-react"
import Colors from "../../Styles/Colors";
import itparklogo from "../../assets/itparklogo.png";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isMobile }) => {
  const menuItems = [
    { name: "Overview", icon: <Layers />, path: "/dashboard/overview" },
    { name: "Users", icon: <User />, path: "/dashboard/users" },
    { name: "Contents", icon: <FileText />, path: "/dashboard/contents" },
    { name: "Analytics", icon: <BarChart />, path: "/dashboard/analytics" },
    { name: "Settings", icon: <Settings />, path: "/dashboard/settings" },
  ];

  return (
    <div
      className={`fixed lg:relative h-full p-4 transition-all duration-300 z-50 shadow-lg ${
        isSidebarOpen ? "w-[350px]" : "w-0 lg:w-[400px]"
      } ${isMobile && !isSidebarOpen ? "hidden" : "block"}`}
      style={{
        background: `linear-gradient(to bottom, ${Colors.deepTeal}, ${Colors.deepBlue})`,
      }}
    >
      {isMobile && (
        <button
          className="absolute top-4 right-4 p-2 text-white hover:bg-gray-200 rounded-xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>
      )}

      <div className="flex justify-center mb-6">
        <img
          src={itparklogo}
          alt="Logo"
          className="w-auto h-[160px] object-contain brightness-110 contrast-150"
        />
      </div>

      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex items-center px-6 py-3 rounded-xl transition-all duration-300 text-white"
            style={({ isActive }) => ({
              backgroundColor: isActive ? Colors.deepAqua : "transparent",
            })}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = Colors.skyTeal)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                e.currentTarget.classList.contains("active")
                  ? Colors.deepAqua
                  : "transparent")
            }
          >
            <span className="text-base md:text-lg">{item.icon}</span>
            <span className="ml-4 text-lg md:text-xl">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
