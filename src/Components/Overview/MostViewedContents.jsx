import { useEffect, useState } from "react";
import axios from "axios";
import ReusablePieChart from "../ReusableChart/ReusablePieChart";
import Colors from "../../Styles/Colors";

const COLORS = [
  Colors.deepBlue,
  Colors.deepTeal,
  Colors.skyTeal,
  Colors.lightTeal,
  Colors.red,
];

const MostViewedContents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMostViewed = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/most-viewed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch most viewed contents:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMostViewed();
  }, []);

  if (loading) return <p>Loading most viewed contents...</p>;
  if (error) return <p>{error}</p>;
  if (data.length === 0) return <p>No data available for most viewed categories.</p>;

  return (
    <ReusablePieChart
      title="Most Viewed Categories"
      data={data}
      dataKey="views"
      nameKey="category"
      colors={COLORS}
      outerRadius={100}
    />
  );
};

export default MostViewedContents;
