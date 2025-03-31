import { NavLink } from "react-router-dom";
import {
  User,
  FileText,
  BarChart,
  Settings,
  Layers,
  Menu,
} from "lucide-react";
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
      className={`fixed lg:relative h-full px-4 py-6 transition-all duration-300 z-50 shadow-lg ${
        isSidebarOpen ? "w-[300px] sm:w-[350px]" : "w-0 lg:w-[350px]"
      } ${isMobile && !isSidebarOpen ? "hidden" : "block"}`}
      style={{
        background: `linear-gradient(to bottom, ${Colors.deepTeal}, ${Colors.deepBlue})`,
      }}
    >
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="absolute top-4 right-4 p-2 text-white hover:bg-gray-200 rounded-xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src={itparklogo}
          alt="Logo"
          className="w-auto h-[140px] md:h-[160px] object-contain brightness-110 contrast-150 mb-4"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex items-center px-4 py-2 rounded-lg transition-all duration-300 text-white text-sm md:text-base lg:text-lg"
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
            <span className="ml-3">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
