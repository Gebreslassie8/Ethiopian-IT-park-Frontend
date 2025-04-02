import React from "react";
import ReusablePieChart from "../ReusableChart/ReusablePieChart";
import Colors from "../../Styles/Colors";

const retentionData = [
  { id: "returning", name: "Returning Users", value: 65 },
  { id: "new", name: "New Users", value: 35 },
];

const RetentionRateChart = () => (
  <div className="flex-1 min-w-full md:min-w-[48%] bg-white shadow-lg rounded-xl p-4">
    <h3 className="text-lg font-medium text-gray-700 mb-4">Retention Rate</h3>
    <ReusablePieChart
      data={retentionData}
      dataKey="value"
      nameKey="name"
      colors={[Colors.deepBlue, Colors.lightTeal]}
      outerRadius={80}
    />
  </div>
);

export default RetentionRateChart;