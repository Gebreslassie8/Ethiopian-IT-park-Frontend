import ReusablePieChart from "../ReusableChart/ReusablePieChart";
import Colors from "../../Styles/Colors";
import PropTypes from "prop-types";

const COLORS = [Colors.deepTeal, Colors.deepBlue, Colors.deepAqua, Colors.skyTeal];

const TimeSpentChart = ({ data }) => {
  return (
    <div className="flex-1 w-full bg-white shadow-lg rounded-xl p-4">
      {data?.length ? (
        <ReusablePieChart
          title="Time Spent on Resource Categories per minutes"
          data={data}
          dataKey="minutes"
          nameKey="category"
          colors={COLORS}
          outerRadius={100}
        />
      ) : (
        <p className="text-sm text-gray-500">No data available.</p>
      )}
    </div>
  );
};
TimeSpentChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      minutes: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TimeSpentChart;
