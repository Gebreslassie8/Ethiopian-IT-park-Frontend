import React from "react";
import StatCard from "../Components/Overview/Card";
import UserGrowthChart from "../Components/Overview/UserGrowthChart";
import {User,FileText,CloudUpload,UserPlus} from "lucide-react";
import RecentlyUploadedContentsTable from "../Components/Overview/RecentlyUploadedContentsTable";
import MostViewedContents from "../Components/Overview/MostViewedContents";

const Overview = () => {
  const stats = [
    {
      id: "total-users",
      title: "Total Users",
      value: "15,786",
      change: "32.40%",
      positive: true,
      icon: User,
      bgColor: "bg-teal-600",
      changeText: "Increased last month",
    },
    {
      id: "total-content",
      title: "Total Content",
      value: "8,785",
      change: "18.2%",
      positive: false,
      icon: FileText,
      bgColor: "bg-yellow-600",
      changeText: "Decreased last month",
    },
    {
      id: "new-uploads",
      title: "New Uploads",
      value: "4,250",
      change: "6.5%",
      positive: true,
      icon: CloudUpload,
      bgColor: "bg-blue-600",
      changeText: "Increased last month",
    },
    {
      id: "new-users",
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserGrowthChart data={data} />
        <MostViewedContents/>
      </div>
      <div>
        <RecentlyUploadedContentsTable/>
      </div>
      
    </div>
  );
};

export default Overview;