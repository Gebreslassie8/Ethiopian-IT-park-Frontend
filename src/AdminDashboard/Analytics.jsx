import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ArrowDownToLine, ArrowUpToLine, Trash, Edit } from "lucide-react";
import Table from "../Components/Table/Table";
import Colors from "../Styles/Colors";

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

const timeSpentData = [
  { day: "Mon", minutes: 30 },
  { day: "Tue", minutes: 45 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 60 },
  { day: "Fri", minutes: 50 },
  { day: "Sat", minutes: 40 },
  { day: "Sun", minutes: 30 },
];

const retentionData = [
  { name: "Returning Users", value: 65 },
  { name: "New Users", value: 35 },
];

const contents = [
  {
    id: "001",
    title: "Introduction to AI",
    category: "Technology",
    creator: "John Doe",
  },
  {
    id: "002",
    title: "History of Ethiopia",
    category: "History",
    creator: "Alemu Bekele",
  },
  {
    id: "003",
    title: "React.js Guide",
    category: "Programming",
    creator: "Sarah Smith",
  },
  {
    id: "004",
    title: "Modern UI Design",
    category: "Design",
    creator: "David Lee",
  },
];

const underutilizedResources = [
  {
    id: "001",
    title: "Advanced CSS Techniques",
    category: "Web Development",
    creator: "Alice Johnson",
  },
  {
    id: "002",
    title: "Data Structures in Python",
    category: "Programming",
    creator: "Bob Smith",
  },
  {
    id: "003",
    title: "Introduction to Quantum Computing",
    category: "Technology",
    creator: "Charlie Brown",
  },
];

const Analytics = () => {
  const handleDelete = (id) => {
    console.log(`Delete resource with id: ${id}`);
  };

  const contentColumns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Category", accessor: "category" },
    { Header: "Content Creator", accessor: "creator" },
  ];

  const resourceColumns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Category", accessor: "category" },
    { Header: "Content Creator", accessor: "creator" },
    {
      Header: "Action",
      accessor: "action",
      Cell: (row) => (
        <div className="flex space-x-6">
          <button className="text-green-500 hover:text-green-700">
            <Edit size={24} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-700 hover:text-red-700"
          >
            <Trash size={24} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="pr-6">
      <div className="flex flex-wrap gap-6">
        {/* Frequently Accessed Contents */}
        <div className="flex-1 min-w-full md:min-w-[calc(60%-12px)] bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Accessed Contents
          </h2>
          <Table columns={contentColumns} data={contents} />
        </div>

        {/* Activity Section */}
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

        {/* Underutilized Resources */}
        <div className="flex-1 min-w-full md:min-w-full bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Underutilized Resources
          </h2>
          <Table columns={resourceColumns} data={underutilizedResources} />
        </div>

        {/* Time Spent Line Chart */}
        <div className="flex-1 min-w-full md:min-w-[50%] bg-white shadow-lg rounded-xl p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Time Spent on Resources
          </h3>
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

        {/* Retention Rate Pie Chart */}
        <div className="flex-1 min-w-full md:min-w-[48%] bg-white shadow-lg rounded-xl p-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Retention Rate
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={retentionData}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                dataKey="value"
              >
                {retentionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? Colors.deepBlue : Colors.lightTeal}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
