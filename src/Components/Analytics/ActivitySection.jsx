// src/Components/Analytics/ActivitySection.jsx

import PropTypes from "prop-types";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Colors from "../../Styles/Colors";

const ActivitySection = ({ data, totals }) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Activity</h2>
      <div className="flex flex-wrap items-center space-x-6">
        <div
          className="flex items-center space-x-3 px-4 py-2 rounded-xl mb-4 sm:mb-0"
          style={{ backgroundColor: Colors.deepBlueShade }}
        >
          <div
            className="text-white p-2 rounded-md"
            style={{ backgroundColor: Colors.deepBlue }}
          >
            <ArrowDownToLine size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Downloads</p>
            <p className="font-bold text-lg text-gray-900">
              {totals.downloads.toLocaleString()}
            </p>
          </div>
        </div>
        <div
          className="flex items-center space-x-3 px-4 py-2 rounded-xl mb-4 sm:mb-0"
          style={{ backgroundColor: Colors.lightTealShade }}
        >
          <div
            className="text-white p-2 rounded-md"
            style={{ backgroundColor: Colors.lightTeal }}
          >
            <ArrowUpToLine size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Uploads</p>
            <p className="font-bold text-lg text-gray-900">
              {totals.uploads.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="month" className="text-gray-600 text-sm" />
            <YAxis hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="downloads"
              stroke={Colors.deepBlue}
              strokeWidth={2}
              fill="none"
              dot={{ r: 0 }}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="uploads"
              stroke={Colors.lightTeal}
              strokeWidth={2}
              fill="none"
              dot={{ r: 0 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
ActivitySection.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  totals: PropTypes.object.isRequired,
}
export default ActivitySection;
