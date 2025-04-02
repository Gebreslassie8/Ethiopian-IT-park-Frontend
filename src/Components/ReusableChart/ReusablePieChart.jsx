import React from "react";
import PropTypes from 'prop-types';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const ReusablePieChart = ({ title, data, dataKey, nameKey, colors, outerRadius = 100 }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-left">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            label
          >
            {data.map((entry) => (
              <Cell key={`cell-${entry[nameKey]}`} fill={colors[data.indexOf(entry) % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

ReusablePieChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      [PropTypes.string]: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      [PropTypes.string]: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  dataKey: PropTypes.string.isRequired,
  nameKey: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  outerRadius: PropTypes.number,
};

export default ReusablePieChart;