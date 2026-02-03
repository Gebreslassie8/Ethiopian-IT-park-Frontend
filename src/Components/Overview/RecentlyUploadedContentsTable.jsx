import React from "react";
import Table from "../table/Table";
import { MoreVertical } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const contentColumns = [
  { Header: "ID", accessor: "id" },
  { Header: "Title", accessor: "title" },
  { Header: "Category", accessor: "category" },
  { Header: "Uploader", accessor: "uploader" },
  { Header: "Uploaded Date", accessor: "uploaded_date" },
  {
    Header: "Action",
    accessor: "action",
    Cell: ({ row }) => {
      const navigate = useNavigate();
      const handleMoreClick = () => {
        navigate(`dashboard/contents${row.original.id}`);
      };

      return (
        <div className="flex space-x-6">
          <button
            className="text-green-500 hover:text-green-700"
            onClick={handleMoreClick}
          >
            <MoreVertical size={24} />
          </button>
        </div>
      );
    },
  },
];

const RecentlyUploadedContentsTable = ({ data }) => {
  return (
    <div className="flex-1 min-w-full md:min-w-full bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Recently Uploaded Contents</h2>
      <Table columns={contentColumns} data={data || []} />
    </div>
  );
};

RecentlyUploadedContentsTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      uploader: PropTypes.string.isRequired,
      uploaded_date: PropTypes.string.isRequired,
      original: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        uploader: PropTypes.string.isRequired,
        uploaded_date: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,

  
};

export default RecentlyUploadedContentsTable;