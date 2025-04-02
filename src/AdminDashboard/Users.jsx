
import { useState } from "react";
import { Trash, Edit } from "lucide-react";
import Table from "../Components/table/Table";
import Button from "../Components/Button/ReusableButton";
import SearchFilterComponent from "../Components/SearchAndFilter/SearchFilterComponent";
import AddUserForm from "../Components/Forms/AddNewUser";

const Users = () => {
  const [users,setUsers] = useState([
    {
      id: 1,
      username: "Sara Mohammed",
      email: "sara@gmail.com",
      role: "internal user",
      createdAt: "March 4, 2025, 12:30 PM",
      status: "Active",
    },
  ]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };
  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: users.length + 1, createdAt: new Date().toLocaleString() }]);
  };


  const columns = [
    { Header: "Id", accessor: "id" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Role", accessor: "role" },
    { Header: "Created at", accessor: "createdAt" },
    { Header: "Status", accessor: "status",
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
            className="text-red-700 hover:text-red-700"
          >
            <Trash size={24} />
          </button>
        </div>
      ),
    },
  ];
   const filterOptions = [
      { label: "Filter by", value: "" },
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      {label:"Internal User" ,value:"internal user"},
      {label:"External User" ,value:"external user"}
    ];

  return (
    <div>
      {/* Container for search, filter, and add button */}
      <div className="flex items-center justify-between mb-4">
        <SearchFilterComponent
         searchPlaceholder="Search Users..."
         onSearchChange={(e) => console.log(`Search: ${e.target.value}`)}
         filterOptions={filterOptions}
         onFilterChange={(e) => console.log(`Filter: ${e.target.value}`)}
          />
        <Button
            type="button"
            label="Add User"
            icon="Plus"
            className="my-2 px-4 md:px-6 text-base md:text-lg py-2"
            onClick={()=> setShowAddUserForm(true)}
          />
           {showAddUserForm && (
        <AddUserForm
          onAddUser={handleAddUser}
          onClose={() => setShowAddUserForm(false)}
        />
      )}
      </div>

      <Table columns={columns} data={users} />
    </div>
  );
};

export default Users;