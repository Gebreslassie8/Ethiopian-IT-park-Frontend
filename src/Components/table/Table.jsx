import React from "react";
import PropTypes from "prop-types";

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md">
      <table className="w-full border-collapse overflow-hidden text-sm md:text-base lg:text-lg rounded-xl">
        <thead className="bg-gray-200">
          <tr className="text-left">
            {columns.map((column) => (
              <th key={column.accessor} className="p-3 border-b font-semibold">
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.accessor} className="p-3">
                  {column.Cell ? column.Cell(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default Table;