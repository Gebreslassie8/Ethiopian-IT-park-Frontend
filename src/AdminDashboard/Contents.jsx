import { useState } from "react";
import { Trash, Edit, Search, Plus } from "lucide-react";
import Colors from "../Styles/Colors";
import Table from "../Components/Table/Table";

const Contents = () => {
  const [contents, setContents] = useState([
    {
      id: 1,
      title: "AI and Its Future",
      category: "Artificial Intelligence",
      creator: "Sara Mohammed",
      createdAt: "March 4, 2025, 12:30 PM",
      accessLevel: "Internal User",
      status: "Active",
    },
  ]);

  const handleDelete = (id) => {
    setContents(contents.filter((content) => content.id !== id));
  };

  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Category", accessor: "category" },
    { Header: "Content Creator", accessor: "creator" },
    { Header: "Created At", accessor: "createdAt" },
    { Header: "Access Level", accessor: "accessLevel" },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => (
        <span
          className={`px-2 py-1 rounded-xl ${
            row.status === "Active" ? "text-green-500" : "text-red-500"
          }`}
        >
          {row.status}
        </span>
      ),
    },
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
            className="text-red-500 hover:text-red-700"
          >
            <Trash size={24} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* search, filter, and add button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 w-1/3">
          <div className="flex items-center border-2 border-gray-600 rounded-xl px-4 py-2 text-base md:text-lg flex-grow">
            <Search className="mr-2" style={{ color: Colors.smokyGray }} />
            <input
              type="text"
              placeholder="Search Content"
              className="flex-grow outline-none"
            />
          </div>
          <select className="border-2 border-gray-600 rounded-xl px-4 py-2 text-base md:text-lg">
            <option value="">Filter by</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Add Button */}
        <button
          className="flex items-center gap-2 text-white px-4 md:px-6 py-2 rounded-2xl text-base md:text-lg"
          style={{ backgroundColor: Colors.deepTeal }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = Colors.skyTeal)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = Colors.deepTeal)
          }
        >
          <Plus />
          Add Content
        </button>
      </div>

      <Table columns={columns} data={contents} />
    </div>
  );
};

export default Contents;