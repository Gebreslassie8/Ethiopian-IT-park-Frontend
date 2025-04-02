import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import Colors from "../../Styles/Colors";
import itparklogo from "../../assets/itparklogo.png";

const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isMobile,
  menuItems,
  sidebarStyles
}) => {
  return (
    <div
      className={`fixed lg:relative h-full px-4 py-6 transition-all duration-300 z-50 shadow-lg ${
        isSidebarOpen ? "w-[300px] sm:w-[350px]" : "w-0 lg:w-[350px]"
      } ${isMobile && !isSidebarOpen ? "hidden" : "block"}`}
      style={{
        background: sidebarStyles.background || `linear-gradient(to bottom, ${Colors.deepTeal}, ${Colors.deepBlue})`,
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
          className="w-auto h-[140px] md:h-[160px] object-contain brightness-110 contrast-150 my-4"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="flex items-center px-4 py-3 rounded-lg transition-all duration-300 text-white text-sm md:text-base lg:text-lg"
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

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  sidebarStyles: PropTypes.shape({
    background: PropTypes.string,
  }),
};

export default Sidebar;
