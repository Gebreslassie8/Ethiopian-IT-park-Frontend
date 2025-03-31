import { useState } from "react";
import { Trash, Edit } from "lucide-react";
import Table from "../Components/Table/Table";
import Button from "../Components/Button/ReusableButton";
import SearchFilterComponent from "../Components/SearchAndFilter/SearchFilterComponent";

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
  const filterOptions=[ 
    {label:"filter by" ,value:""},
    {label:"Actitve",value:"active"},
   {label:"Inactive" ,value:"inactive"}
  ];

  return (
    <div>
      {/* search, filter, and add button */}
      <div className="flex items-center justify-between mb-4">
        <SearchFilterComponent
         searchPlaceholder="Search Contents..."
         onSearchChange={(e)=> console.log (e.target.value)}
         filterOptions={filterOptions}
         onFilterChange={(e)=> console.log (e.target.value)}
         />

        {/* Add Button */}

        <Button
          type="button"
          label="Upload Content"
          icon="Plus"
          className="my-2 px-4 md:px-6 text-base md:text-lg gap-2 py-2"
        />
      </div>

      <Table columns={columns} data={contents} />
    </div>
  );
};

export default Contents;
