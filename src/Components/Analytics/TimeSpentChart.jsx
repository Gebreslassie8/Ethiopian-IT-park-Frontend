import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Colors from "../../Styles/Colors";

const timeSpentData = [
  { day: "Mon", minutes: 30 },
  { day: "Tue", minutes: 45 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 60 },
  { day: "Fri", minutes: 50 },
  { day: "Sat", minutes: 40 },
  { day: "Sun", minutes: 30 },
];

const TimeSpentChart = () => (
  <div className="flex-1 min-w-full md:min-w-[50%] bg-white shadow-lg rounded-xl p-4">
    <h3 className="text-lg font-medium text-gray-700 mb-4">Time Spent on Resources</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timeSpentData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="minutes"
          stroke={Colors.deepTeal}
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TimeSpentChart;