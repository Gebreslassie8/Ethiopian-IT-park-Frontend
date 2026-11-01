import React from "react";
import Table from "../table/Table";
import { MoreVertical } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// ─── Action button as its own component (so useNavigate can run) ───
function ActionCell({ row }) {
  const navigate = useNavigate();

  // Handle both shapes: { row: { original: {...} } } (TanStack) and { row: {...} } (custom)
  const id = row?.original?.id ?? row?.id;

  const handleMoreClick = () => {
    if (!id) {
      console.warn("No id found on row:", row);
      return;
    }
    navigate(`/dashboard/contents/${id}`);
  };

  return (
    <div className="flex space-x-6">
      <button
        type="button"
        className="text-green-500 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleMoreClick}
        disabled={!id}
        aria-label="View content"
      >
        <MoreVertical size={24} />
      </button>
    </div>
  );
}

ActionCell.propTypes = {
  row: PropTypes.object,
};

// ─── Columns ───
const contentColumns = [
  { Header: "ID", accessor: "id" },
  { Header: "Title", accessor: "title" },
  { Header: "Category", accessor: "category" },
  { Header: "Uploader", accessor: "uploader" },
  { Header: "Uploaded Date", accessor: "uploaded_date" },
  {
    Header: "Action",
    accessor: "action",
    Cell: ActionCell,
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
  data: PropTypes.array,
};

export default RecentlyUploadedContentsTable;