import React from "react";
import PropTypes from "prop-types";

const Table = ({ columns, data }) => {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-xl shadow-md">
      <table className="min-w-full border-collapse text-sm md:text-base">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap border-b border-gray-200"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || row.content_id || `row-${rowIndex}`}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={`${row.id || row.content_id || rowIndex}-${column.accessor}-${colIndex}`}
                    className="px-4 py-3 text-gray-800 max-w-[220px] truncate"
                  >
                    {column.Cell ? column.Cell(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
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
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;