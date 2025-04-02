import React from "react";
import Table from "../table/Table";
import { Trash, Edit } from "lucide-react";

const recentlyUploadedContents = [
  {
    id: "101",
    title: "Modern JavaScript Features",
    category: "Web Development",
    uploader: "David Lee",
  },
  {
    id: "102",
    title: "Machine Learning Basics",
    category: "Data Science",
    uploader: "Emma Watson",
  },
  {
    id: "103",
    title: "Blockchain Essentials",
    category: "Technology",
    uploader: "John Doe",
  },
];

const handleDelete = (id) => {
  console.log(`Delete content with id: ${id}`);
};

const contentColumns = [
  { Header: "ID", accessor: "id" },
  { Header: "Title", accessor: "title" },
  { Header: "Category", accessor: "category" },
  { Header: "Uploader", accessor: "uploader" },
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

const RecentlyUploadedContentsTable = () => (
  <div className="flex-1 min-w-full md:min-w-full bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4">Recently Uploaded Contents</h2>
    <Table columns={contentColumns} data={recentlyUploadedContents} />
  </div>
);

export default RecentlyUploadedContentsTable;