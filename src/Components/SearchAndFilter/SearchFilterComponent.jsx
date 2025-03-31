
import React from "react";
import { Search } from "lucide-react";
import Colors from "../../Styles/Colors";

const SearchFilterComponent = ({ searchPlaceholder, onSearchChange, filterOptions, onFilterChange }) => {
  return (
    <div className="flex items-center gap-2 w-2/3">
      <div className="flex items-center border-2 border-gray-600 rounded-2xl px-4 py-2 text-base md:text-lg flex-grow">
        <Search className="mr-2 w-6 h-6" style={{ color: Colors.smokyGray }} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="flex-grow outline-none"
          onChange={onSearchChange}
        />
      </div>
      <select
        className="border-2 border-gray-600 rounded-2xl px-4 py-2 text-base md:text-lg w-60"
        onChange={onFilterChange}
      >
        {filterOptions.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterComponent;
