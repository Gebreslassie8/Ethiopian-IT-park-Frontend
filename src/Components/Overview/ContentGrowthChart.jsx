// ContentGrowthChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Text } from "@chakra-ui/react";
import Colors from "../../Styles/Colors";
import PropTypes from "prop-types";

const ContentGrowthChart = ({ data }) => (
  <div className="bg-white shadow-md p-6 rounded-xl w-full">
    <Text className="text-lg font-semibold" style={{ color: Colors.smokyGray }}>
      Content Growth Rate
    </Text>
    <Text className="text-sm text-gray-500 mb-4">Tracking growth trends.</Text>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="uploads" fill={Colors.deepAqua} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

ContentGrowthChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uploads: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ContentGrowthChart;
