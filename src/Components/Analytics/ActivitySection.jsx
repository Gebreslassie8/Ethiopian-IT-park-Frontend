import React from "react";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Colors from "../../Styles/Colors";

const data = [
  { month: "Jan", downloads: 1200, uploads: 2000 },
  { month: "Feb", downloads: 4500, uploads: 4000 },
  { month: "Mar", downloads: 6000, uploads: 5000 },
  { month: "Apr", downloads: 4000, uploads: 7000 },
  { month: "May", downloads: 3000, uploads: 4000 },
  { month: "Jun", downloads: 7000, uploads: 5000 },
  { month: "Jul", downloads: 6000, uploads: 6000 },
  { month: "Aug", downloads: 5000, uploads: 4500 },
  { month: "Sep", downloads: 4000, uploads: 7000 },
  { month: "Oct", downloads: 6000, uploads: 6500 },
  { month: "Nov", downloads: 5000, uploads: 4000 },
  { month: "Dec", downloads: 3000, uploads: 8000 },
];

const ActivitySection = () => (
  <div className="flex-1 min-w-full md:min-w-[calc(40%-12px)] bg-white p-6 rounded-xl shadow-lg">
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
          <p className="font-bold text-lg text-gray-900">15,556</p>
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
          <p className="font-bold text-lg text-gray-900">10,065</p>
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

export default ActivitySection;