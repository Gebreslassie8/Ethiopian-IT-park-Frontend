import Table from "../table/Table";
import { MoreVertical } from "lucide-react";
import PropTypes from "prop-types";

const resourceColumns = [
  { Header: "ID", accessor: "content_id" },
  { Header: "Title", accessor: "title" },
  { Header: "Category", accessor: "category" },
  { Header: "Content Creator", accessor: "creator" },
  {
    Header: "Action",
    accessor: "action",
    Cell: () => (
      <div className="flex space-x-6">
        <button className="text-green-500 hover:text-green-700">
          <MoreVertical size={24} />
        </button>
      </div>
    ),
  },
];

const ResourcesTable = ({ title, data }) => (
  <div className="w-full bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <Table columns={resourceColumns} data={data} />
  </div>
);
ResourcesTable.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}
export default ResourcesTable;
