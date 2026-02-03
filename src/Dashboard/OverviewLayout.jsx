// OverviewLayout.jsx
import StatCard from "../Components/Overview/Card";
import MostViewedContents from "../Components/Overview/MostViewedContents";
import RecentlyUploadedContentsTable from "../Components/Overview/RecentlyUploadedContentsTable";
import PropTypes from "prop-types";

const OverviewLayout = ({ stats, ChartComponent, chartData, recentContents }) => {
  return (
    <div className="space-y-6 p-4">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Chart + Most Viewed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ChartComponent && <ChartComponent data={chartData} />}
        <MostViewedContents />
      </div>

      {/* Recently Uploaded */}
      <div>
        <RecentlyUploadedContentsTable data={recentContents} />
      </div>
    </div>
  );
};

OverviewLayout.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      // Add other properties of the stat object as needed
    })
  ).isRequired,
  ChartComponent: PropTypes.elementType, // ChartComponent should be a React component
  chartData: PropTypes.array, // Assuming chartData is an array
  recentContents: PropTypes.array.isRequired, // Assuming recentContents is an array
};
export default OverviewLayout;
