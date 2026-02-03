import { Search } from "lucide-react";
import Colors from "../../Styles/Colors";
import PropTypes from "prop-types";

const SearchFilterComponent = ({
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  filterField,
  onFilterChange,
  filterOptions,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:flex-wrap items-center gap-2 w-full md:w-2/3">
      <div className="flex items-center border-2 border-gray-600 rounded-2xl px-4 py-2 text-base md:text-lg flex-grow w-full md:w-auto">
        <Search className="mr-2 w-6 h-6" style={{ color: Colors.smokyGray }} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          className="flex-grow outline-none"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="border-2 border-gray-600 rounded-2xl px-4 py-2 text-base md:text-lg w-full md:w-auto"
        value={filterField}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        {filterOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

SearchFilterComponent.propTypes = {
  searchPlaceholder: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterField: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SearchFilterComponent;
