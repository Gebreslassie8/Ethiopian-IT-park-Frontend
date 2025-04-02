import React from "react";
import ReusablePieChart from "../ReusableChart/ReusablePieChart";

const data = [
  { category: "Technology", views: 2500 },
  { category: "Science", views: 1800 },
  { category: "History", views: 1200 },
  { category: "Art", views: 900 },
];

const COLORS = ["#4F46E5", "#22C55E", "#EAB308", "#F43F5E"];

const MostViewedContents = () => {
  return (
    <ReusablePieChart
      title="Most Viewed Categories"
      data={data}
      dataKey="views"
      nameKey="category"
      colors={COLORS}
      outerRadius={100}
    />
  );
};

export default MostViewedContents;