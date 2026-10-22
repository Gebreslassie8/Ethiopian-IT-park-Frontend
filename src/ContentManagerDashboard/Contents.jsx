import { useEffect, useState } from "react";
import { Edit, ArchiveRestore, Archive, Trash, Plus } from "lucide-react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import Table from "../Components/table/Table";
import Button from "../Components/Button/ReusableButton";
import AddContents from "../Components/Forms/AddContents";
import ReusableModal from "../Components/Modals/ReusableModal";

const Contents = () => {
  const [contents, setContents] = useState([]);
  const [isAddContentsVisible, setIsAddContentsVisible] = useState(false);
  const [editContentId, setEditContentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formValues, setFormValues] = useState({
    title: "",
    tag: "",
    description: "",
    contentCreator: "",
    category: "",
    access_level: "",
    file_url: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccess, setFilterAccess] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("Active");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const toast = useToast();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchContents();
  }, [activeTab, searchQuery, filterAccess, sortOrder]);

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

 const fetchContents = async () => {
  try {
    const endpoint =
      activeTab === "Archived"
        ? `${import.meta.env.VITE_API_URL}/api/archived`
        : `${import.meta.env.VITE_API_URL}/api/search`;

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        search: searchQuery,
        accessLevel: filterAccess === "all" ? "" : filterAccess,
        sortOrder,
          categoryIds: JSON.stringify([]), 
      },
    });

    setContents(response.data);
    setCurrentPage(1);
  } catch (error) {
    console.error("Error fetching contents:", error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    toast({
      title: "Error",
      description: "Failed to fetch contents.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

  const handleAddContents = () => {
    setEditContentId(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormValues({
      title: "",
      tag: "",
      description: "",
      contentCreator: "",
      category: "",
      access_level: "",
      file_url: null,
    });
    setIsAddContentsVisible(true);
  };

  const handleEdit = async (content) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/edit/${content.content_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditContentId(data.content_id);
      setFormValues({
        title: data.title,
        tag: Array.isArray(data.tag) ? data.tag.join(", ") : data.tag,
        description: data.description,
        contentCreator: data.author,
        category: data.category,
        access_level: data.access_level,
        file_url: data.file_url,
      });
      setPreviewUrl(data.file_url || null);
      setIsAddContentsVisible(true);
    } catch (error) {
      console.error("Error fetching content for editing:", error);
      toast({
        title: "Error",
        description: "Failed to fetch content details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      const tagsArray = Array.isArray(values.tag)
        ? values.tag
        : values.tag
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

      formData.append("title", values.title);
      formData.append("tag", tagsArray.join(", "));
      formData.append("description", values.description);
      formData.append("access_level", values.access_level);
      formData.append("contentCreator", values.contentCreator);
      formData.append("category", values.category);

      if (values.file) {
        formData.append("file", values.file);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editContentId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/edit/${editContentId}`,
          formData,
          config
        );
        toast({
          title: "Content updated.",
          description: "Content updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, config);
        toast({
          title: "Content uploaded.",
          description: "Content uploaded successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      setIsAddContentsVisible(false);
      fetchContents();
    } catch (error) {
      const message =
        error.response?.status === 409
          ? "Content already exists."
          : error.response?.data?.error || "An unknown error occurred.";
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleArchiveToggle = async (content_id) => {
    const isArchived = activeTab === "Archived";
    const endpoint = isArchived
      ? `${import.meta.env.VITE_API_URL}/api/restore/${content_id}`
      : `${import.meta.env.VITE_API_URL}/api/archive/${content_id}`;
    try {
      await axios.patch(endpoint, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Success",
        description: `Content ${
          isArchived ? "restored" : "archived"
        } successfully.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      fetchContents();
    } catch (error) {
      console.error("Error updating archive status:", error);
      toast({
        title: "Error",
        description: "Failed to update archive status.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClick = (content_id) => {
    setContentToDelete(content_id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contentToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/delete/${contentToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Success",
        description: `Content ${
          activeTab === "Archived" ? "permanently deleted" : "deleted"
        }.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchContents();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      setIsModalOpen(false);
      setContentToDelete(null);
    }
  };

  const accessLevelOptions = [
    { label: "All Access Levels", value: "all" },
    { label: "Public", value: "externaluser" },
    { label: "Private", value: "internaluser" },
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContents = contents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contents.length / itemsPerPage);

  const columns = [
    { Header: "Id", accessor: "content_id" },
    { Header: "Title", accessor: "title" },
    { Header: "Category", accessor: "category" },
    { Header: "Tag", accessor: "tag" },
    { Header: "Content Creator", accessor: "author" },
    { Header: "Uploaded Date", accessor: "uploaded_date" },
    { Header: "Access Level", accessor: "access_level" },
    {
      Header: "Action",
      accessor: "action",
      Cell: (content) => {
        return (
          <div className="flex space-x-4">
            {activeTab !== "Archived" && (
              <button
                onClick={() => handleEdit(content)}
                className="text-green-500 hover:text-green-700"
                disabled={isDeleting}
              >
                <Edit size={18} />
              </button>
            )}
            <button
              onClick={() => handleArchiveToggle(content.content_id)}
              className="text-blue-500 hover:text-blue-700"
              disabled={isDeleting}
            >
              {activeTab === "Archived" ? (
                <ArchiveRestore size={18} />
              ) : (
                <Archive size={18} />
              )}
            </button>
            {activeTab === "Archived" && (
              <button
                onClick={() => handleDeleteClick(content.content_id)}
                className="text-red-500 hover:text-red-700"
                disabled={isDeleting}
              >
                <Trash size={20} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-full z-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 md:gap-4 w-full">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition w-full sm:w-48 md:w-64"
          />
          <select
            value={filterAccess}
            onChange={(e) => setFilterAccess(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition w-full sm:w-36 md:w-48"
          >
            {accessLevelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition w-full sm:w-36 md:w-48"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          label="Upload Content"
          icon="Plus"
          onClick={handleAddContents}
          className="my-2 px-3 md:px-6 text-sm md:text-lg py-2 w-full sm:w-auto"
        />
      </div>

      <div className="flex mb-4 space-x-2 sm:space-x-4">
        <button
          onClick={() => setActiveTab("Active")}
          className={`px-3 md:px-4 py-2 rounded text-sm md:text-base font-semibold transition ${
            activeTab === "Active"
              ? "border-b-4 border-teal-800 text-gray-900 bg-gray-100"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab("Archived")}
          className={`px-3 md:px-4 py-2 rounded text-sm md:text-base font-semibold transition ${
            activeTab === "Archived"
              ? "border-b-4 border-teal-800 text-gray-900 bg-gray-100"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          Archived
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-sm bg-white">
        <Table columns={columns} data={currentContents} />
      </div>

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
        >
          Previous
        </button>
        <span className="mx-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-teal-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {isAddContentsVisible && (
        <AddContents
          initialValues={formValues}
          onClose={() => setIsAddContentsVisible(false)}
          onSubmit={handleSubmit}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          contentId={editContentId}
        />
      )}

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setContentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${activeTab === "Archived" ? "Archived " : ""}Content`}
        body={`Are you sure you want to delete this ${
          activeTab === "Archived"
            ? "archived content permanently? This cannot be undone."
            : "content?"
        }`}
        cancelText="Cancel"
        confirmText={activeTab === "Archived" ? "Delete Permanently" : "Delete"}
        confirmColor="red"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Contents;

