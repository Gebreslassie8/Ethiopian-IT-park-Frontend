import React from "react";
import Table from "../table/Table";

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

const contentColumns = [
  { Header: "ID", accessor: "id" },
  { Header: "Title", accessor: "title" },
  { Header: "Category", accessor: "category" },
  { Header: "Content Creator", accessor: "creator" },
];

const ContentTable = () => (
  <div className="flex-1 min-w-full md:min-w-[calc(60%-12px)] bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4">Frequently Accessed Contents</h2>
    <Table columns={contentColumns} data={contents} />
  </div>
);

export default ContentTable;