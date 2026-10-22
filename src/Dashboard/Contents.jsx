import { useEffect, useState } from "react";
import { Trash, Edit } from "lucide-react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import Table from "../Components/table/Table";
import Button from "../Components/Button/ReusableButton";
import SearchFilterComponent from "../Components/SearchAndFilter/SearchFilterComponent";
import AddContents from "../Components/Forms/AddContents";
import ReusableModal from "../Components/Modals/ReusableModal";

const Contents = ({ role }) => {
  const [contents, setContents] = useState([]);
  const [isAddContentsVisible, setIsAddContentsVisible] = useState(false);
  const [editContentId, setEditContentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterField, setFilterField] = useState("");
  const toast = useToast();

  const [formValues, setFormValues] = useState({
    title: "",
    tag: "",
    description: "",
    contentCreator: "",
    category: "",
    access_level: "",
    file_url: null,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!searchQuery || !filterField || filterField === "all") {
        fetchContents();
      } else {
        fetchContents(searchQuery, filterField);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filterField]);

  const fetchContents = async (query = "", field = "") => {
    try {
      const isFiltering = query && field && field !== "all";
      const url = isFiltering
        ? `${import.meta.env.VITE_API_URL}/api/search`
        : `${import.meta.env.VITE_API_URL}/api/contents`;

      const response = isFiltering
        ? await axios.get(url, { params: { field, query } })
        : await axios.get(url);

      setContents(response.data);
    } catch (error) {
      console.error("Error fetching contents:", error);
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
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/edit/${content.content_id}`);
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

  const handleDelete = (content_id) => {
    setContentToDelete(content_id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      const tagsArray = Array.isArray(values.tag)
        ? values.tag
        : values.tag.split(",").map((tag) => tag.trim()).filter(Boolean);

      formData.append("title", values.title);
      formData.append("tag", tagsArray.join(", "));
      formData.append("description", values.description);
      formData.append("access_level", values.access_level);
      formData.append("contentCreator", values.contentCreator);
      formData.append("category", values.category);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (editContentId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/edit/${editContentId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast({
          title: "Content updated.",
          description: "Content updated successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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

  const canEdit = role === "admin" || role === "content_manager";
  const canDelete = role === "admin";
  const canUpload = role === "admin" || role === "content_manager";

  const columns = [
    { Header: "Id", accessor: "content_id" },
    { Header: "Title", accessor: "title" },
    { Header: "Category", accessor: "category" },
    { Header: "Tag", accessor: "tag" },
    { Header: "Content Creator", accessor: "author" },
    { Header: "Uploaded Date", accessor: "uploaded_date" },
    { Header: "Access Level", accessor: "access_level" },
    {
      Header: "Status",
      accessor: "status",
      Cell: (row) => (
        <span className={`px-2 py-1 rounded-xl ${row.status === "Active" ? "text-green-500" : "text-red-500"}`}>
          {row.status}
        </span>
      ),
    },
    ...(canEdit || canDelete
      ? [
          {
            Header: "Action",
            accessor: "action",
            Cell: (row) => (
              <div className="flex space-x-6">
                {canEdit && (
                  <button className="text-green-500 hover:text-green-700" onClick={() => handleEdit(row)}>
                    <Edit size={24} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => handleDelete(row.content_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={24} />
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <SearchFilterComponent
          searchPlaceholder="Search Contents..."
          searchQuery={searchQuery}
          onSearchChange={(value) => setSearchQuery(value)}
          filterField={filterField}
          onFilterChange={(value) => setFilterField(value)}
          filterOptions={[
            { label: "All", value: "all" },
            { label: "Title", value: "title" },
            { label: "Category", value: "category" },
            { label: "Tag", value: "tag" },
            { label: "Content Creator", value: "author" },
          ]}
        />
        {canUpload && (
          <Button
            type="button"
            label="Upload Content"
            icon="Plus"
            className="my-2 px-4 md:px-6 text-base md:text-lg py-2"
            onClick={handleAddContents}
          />
        )}
      </div>

      <Table columns={columns} data={contents} />

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
        onClose={() => setIsModalOpen(false)}
        onConfirm={async () => {
          try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/delete/${contentToDelete}`);
            toast({
              title: "Content deleted.",
              description: "The content has been deleted successfully.",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
            fetchContents();
          } catch (error) {
            console.error("Error deleting content:", error);
            toast({
              title: "Error deleting content.",
              description: "Failed to delete content. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top-right",
            });
          } finally {
            setIsModalOpen(false);
          }
        }}
        title="Delete Content"
        body="Are you sure you want to delete this content?"
        cancelText="Cancel"
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

Contents.propTypes = {
  role: PropTypes.string.isRequired, // role is a required string
};

export default Contents;
