import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // <-- Import X icon
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
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 shadow-lg transition-all duration-300
          bg-gradient-to-b from-[${Colors.deepTeal}] to-[${Colors.deepBlue}]
          ${isSidebarOpen ? "w-64 sm:w-72 md:w-80" : "w-0"}
          ${isSidebarOpen ? "block" : "hidden"}
          lg:block lg:relative lg:w-72
          px-2 sm:px-4 py-4
        `}
        style={{
          background: sidebarStyles.background || `linear-gradient(to bottom, ${Colors.deepTeal}, ${Colors.deepBlue})`,
          overflowY: "auto"
        }}
      >
           {/* Mobile Close (X) Button - only visible when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-[100] p-2 bg-teal-700 text-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={28} />
        </button>
      )}

        {/* Logo */}
        <div className="flex justify-center mb-8 mt-2">
          <img
            src={itparklogo}
            alt="IT Park Logo"
            className="w-auto h-20 sm:h-28 md:h-32 object-contain brightness-110 contrast-150 mb-8"
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 sm:gap-3 md:gap-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={`
                flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg
                transition-all duration-200 text-white
                text-sm sm:text-base md:text-lg
                hover:bg-[${Colors.skyTeal}]
                focus:outline-none focus:ring-2 focus:ring-teal-400
              `}
              style={({ isActive }) => ({
                backgroundColor: isActive ? Colors.deepAqua : "transparent",
              })}
              aria-current={({ isActive }) => (isActive ? "page" : undefined)}
            >
              <span className="text-base sm:text-lg md:text-xl" aria-hidden="true">{item.icon}</span>
              <span className="ml-3 truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
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