import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Colors from "../Styles/Colors"
const data = [
  { category: "E-books", viewed: 80, downloaded: 100 },
  { category: "Videos", viewed: 60, downloaded: 90 },
  { category: "Podcasts", viewed: 70, downloaded: 50 }, // Corrected capitalization
  { category: "Articles", viewed: 100, downloaded: 80 },
];

const MostViewedDownloaded = () => {
  return (
    <div className="p-10 bg-white rounded-2xl shadow-lg w-1/2">
      <h2 className="text-xl font-bold mb-2">Most Viewed & Downloaded</h2>
      <ResponsiveContainer width="100%" height={300}>     
        <BarChart layout="vertical" data={data} margin={{ left: 40 }}> {/* Increased left margin */}
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="viewed" fill={Colors.lightTeal} name="Viewed" barSize={24} radius={[0,10,10,0]}/>
          <Bar dataKey="downloaded" fill={Colors.deepBlue} name="Downloaded" barSize={24} radius={[0,10,10,0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MostViewedDownloaded;