import React from 'react';

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-md">
      <table className="w-full border-collapse overflow-hidden text-xl rounded-xl">
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
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b hover:bg-gray-50">
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

export default Table;