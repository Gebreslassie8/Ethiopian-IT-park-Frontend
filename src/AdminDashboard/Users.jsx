import { useEffect, useState } from "react";
import axios from "axios";
import { Trash, Edit } from "lucide-react";
import { toast, Toaster } from "sonner";
import Table from "../Components/table/Table";
import Button from "../Components/Button/ReusableButton";
import SearchFilterComponent from "../Components/SearchAndFilter/SearchFilterComponent";
import AddUserForm from "../Components/Forms/AddNewUser";
import ReusableModal from "../Components/Modals/ReusableModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://ethiopian-it-park-backend.onrender.com/api/users/filter`, {
        params: {
          search: searchTerm,
          status: filterValue,
        },
      });

      const formattedUsers = response.data.map((user) => ({
        ...user,
        createdAt: new Date(user.created_at).toLocaleString(),
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, filterValue]);

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(5);
      else if (width < 768) setItemsPerPage(10);
      else if (width < 1024) setItemsPerPage(15);
      else setItemsPerPage(20);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleDelete = (user_id) => {
    setPendingDeleteUserId(user_id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteUserId) return;

    try {
      const response = await axios.delete(
        `https://ethiopian-it-park-backend.onrender.com/api/users/delete/${pendingDeleteUserId}`
      );
      if (response.status === 200) {
        setUsers(users.filter((user) => user.user_id !== pendingDeleteUserId));
        toast.success("The user has been deleted successfully.");
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user.");
    } finally {
      setIsModalOpen(false);
      setPendingDeleteUserId(null);
    }
  };

  const handleAddUser = async (values, { resetForm }) => {
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      };

      await axios.post(`https://ethiopian-it-park-backend.onrender.com/api/users/register`, payload);
      await fetchUsers();
      resetForm();
      setShowAddUserForm(false);
      toast.success("User added successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add user.");
    }
  };

  const handleEditUser = async (values, { resetForm }) => {
    try {
      const payload = { ...values };
      await axios.put(
        `https://ethiopian-it-park-backend.onrender.com/api/users/edit/${editingUser.user_id}`,
        payload
      );
      await fetchUsers();
      resetForm();
      setEditingUser(null);
      setShowAddUserForm(false);
      toast.success("User updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowAddUserForm(true);
  };

  const columns = [
    { Header: "Id", accessor: "user_id" },
    { Header: "Username", accessor: "username" },
    { Header: "Email", accessor: "email" },
    { Header: "Created at", accessor: "createdAt" },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => (
        <span
          className={`px-2 py-1 rounded-xl ${
            row.status === "active" ? "text-green-500" : "text-red-500"
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
          <button
            onClick={() => handleEdit(row)}
            className="text-green-500 hover:text-green-700"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.user_id)}
            className="text-red-700 hover:text-red-700"
          >
            <Trash size={18} />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Toaster
        position="center"
        toastOptions={{ style: { fontSize: "1.25rem", padding: "1rem" } }}
      />
      <div className="flex items-center justify-between mb-2">
        <SearchFilterComponent
          searchPlaceholder="Search Users..."
          onSearchChange={setSearchTerm}
          filterOptions={filterOptions}
          onFilterChange={setFilterValue}
        />
        <Button
          type="button"
          label="Add User"
          icon="Plus"
          className="my-2 px-4 md:px-6 text-base md:text-lg py-2"
          onClick={() => {
            setEditingUser(null);
            setShowAddUserForm(true);
          }}
        />
        {showAddUserForm && (
          <AddUserForm
            onSubmit={editingUser ? handleEditUser : handleAddUser}
            onClose={() => setShowAddUserForm(false)}
            initialValues={
              editingUser || {
                username: "",
                email: "",
                password: "",
                role: "",
              }
            }
            formTitle={editingUser ? "Edit User" : "Add User"}
          />
        )}
      </div>

      <Table columns={columns} data={currentUsers} />

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        body="Are you sure you want to delete this user?"
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default Users;
