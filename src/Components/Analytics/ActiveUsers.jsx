import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Colors from "../../Styles/Colors";

const ActiveUsersChart = ({ data }) => {
  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Active Users</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            stroke="#888"
            tick={{ fontSize: 12 }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#888"
            tick={{ fontSize: 12 }}
            label={{
              value: "Users",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fill: "#555", fontSize: 13 },
            }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderColor: "#ddd" }}
            labelStyle={{ color: "#333", fontWeight: "500" }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke={Colors.deepTeal}
            strokeWidth={3}
            dot={false} // Hide static dots
            activeDot={{
              r: 6,
              stroke: Colors.deepTeal,
              strokeWidth: 2,
              fill: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

ActiveUsersChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      users: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ActiveUsersChart;
