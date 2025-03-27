import React from "react";
import {
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Icon,
} from "@chakra-ui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { User, FileText, CloudUpload, UserPlus } from "lucide-react"; 
import Colors from "../Styles/Colors";
import Table from "../Components/Table/Table";

const Overview = () => {
  const stats = [
    {
      title: "Total Users",
      value: "15,786",
      change: "32.40%",
      positive: true,
      icon: User,
      bgColor: "bg-teal-600",
      changeText: "Increased last month",
    },
    {
      title: "Total Content",
      value: "8,785",
      change: "18.2%",
      positive: false,
      icon: FileText,
      bgColor: "bg-yellow-600",
      changeText: "Decreased last month",
    },
    {
      title: "New Uploads",
      value: "4,250",
      change: "6.5%",
      positive: true,
      icon: CloudUpload,
      bgColor: "bg-blue-600",
      changeText: "Increased last month",
    },
    {
      title: "New Users",
      value: "2,580",
      change: "12.4%",
      positive: true,
      icon: UserPlus,
      bgColor: "bg-green-600",
      changeText: "Increased last month",
    },
  ];

  const data = [
    { name: "Jan", users: 5000 },
    { name: "Feb", users: 7500 },
    { name: "Mar", users: 6800 },
    { name: "Apr", users: 5200 },
    { name: "May", users: 6000 },
    { name: "Jun", users: 7500 },
    { name: "Jul", users: 7200 },
    { name: "Aug", users: 6800 },
    { name: "Sep", users: 4900 },
    { name: "Oct", users: 6200 },
    { name: "Nov", users: 7600 },
    { name: "Dec", users: 7800 },
  ];

  const topViewedContents = [
    {
      id: 1,
      title: "The Future of AI",
      category: "Artificial Intelligence",
      creator: "Sara Mohammed",
    },
    {
      id: 2,
      title: "Web3 and Blockchain",
      category: "Technology",
      creator: "John Doe",
    },
    {
      id: 3,
      title: "React Performance Optimization",
      category: "Web Development",
      creator: "Emily Brown",
    },
  ];

  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Category", accessor: "category" },
    { Header: "Content Creator", accessor: "creator" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md p-4 rounded-2xl border">
            <CardBody className="flex items-center space-x-4">
              {/* Icon Wrapper */}
              <div
                className={`w-16 h-16 flex items-center justify-center ${stat.bgColor} rounded-xl text-white`}
              >
                <Icon as={stat.icon} boxSize={10} />
              </div>

              {/* Stat Content */}
              <Stat>
                <StatLabel
                  className="text-sm"
                  style={{ color: Colors.smokyGray }}
                >
                  {stat.title}
                </StatLabel>
                <StatNumber className="text-xl font-bold">
                  {stat.value}
                </StatNumber>
                <StatHelpText
                  className={`text-sm flex items-center ${
                    stat.positive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <StatArrow type={stat.positive ? "increase" : "decrease"} />
                  {stat.change} {stat.changeText}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* User Growth Rate Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white shadow-md p-6 rounded-xl w-full">
          <Text
            className="text-lg font-semibold"
            style={{ color: Colors.smokyGray }}
          >
            User Growth Rate
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Tracking user engagement trends.
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill={Colors.deepAqua} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Top Viewed Contents */}
      <div className="bg-white shadow-md p-6 rounded-xl">
        <Text
          className="text-lg font-semibold mb-4"
          style={{ color: Colors.smokyGray }}
        >
          Top Viewed Contents
        </Text>
        <Table columns={columns} data={topViewedContents} />
      </div>
    </div>
  );
};

export default Overview;