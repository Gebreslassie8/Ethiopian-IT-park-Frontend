import React from "react";
import Table from "../table/Table";
import { Trash, Edit } from "lucide-react";

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

const handleDelete = (id) => {
  console.log(`Delete resource with id: ${id}`);
};

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

const UnderutilizedResourcesTable = () => (
  <div className="flex-1 min-w-full md:min-w-full bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4">Underutilized Resources</h2>
    <Table columns={resourceColumns} data={underutilizedResources} />
  </div>
);

export default UnderutilizedResourcesTable;