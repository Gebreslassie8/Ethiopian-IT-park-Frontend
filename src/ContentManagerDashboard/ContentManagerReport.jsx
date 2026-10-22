import React, { useEffect, useState, useRef } from 'react';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import Table from '../Components/table/Table';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend
} from 'recharts';

const ContentManagerReport = () => {
  const [reportType, setReportType] = useState('recentUploads');
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    setCurrentPage(1); // Reset page on report change
  }, [reportType]);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `https://ethiopian-it-park-backend.onrender.com/api/cm-reports/${reportType}?page=${currentPage}&limit=${itemsPerPage}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || `Failed to fetch ${reportType} report`);
        }

        const result = await response.json();

        const fetchedData = Array.isArray(result.data) ? result.data : result.data ? [result.data] : [];
        setData(fetchedData);
        setTotalPages(result.totalCount ? Math.ceil(result.totalCount / itemsPerPage) : 1);

        if (fetchedData.length === 0) {
          setError(`No data found for ${reportType}`);
        }
      } catch (err) {
        setError(err.message || 'Failed to load report data');
        setData([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, currentPage, itemsPerPage]);

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const exportCSV = () => {
    if (data.length === 0) return;

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row =>
        Object.values(row)
          .map(value => (typeof value === 'object' && value !== null ? JSON.stringify(value) : value))
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to use this feature.');
      return;
    }

    const printContent = `
      <html>
        <head>
          <title>${reportType} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <h1>${reportType.replace(/([A-Z])/g, ' $1')}</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
          ${printRef.current.innerHTML}
          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getReportConfig = () => {
    switch (reportType) {
      case 'recentUploads':
        return {
          columns: [
            { Header: 'Title', accessor: 'title' },
            { Header: 'Author', accessor: 'author' },
            { Header: 'Access Level', accessor: 'access_level' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'Upload Date', accessor: 'upload_date' },
            { Header: 'Views', accessor: 'views' },
            { Header: 'Downloads', accessor: 'downloads' },
            { Header: 'Format', accessor: 'file_format' }
          ],
          chartType: null
        };

      case 'statusOverview':
        return {
          columns: [
            { Header: 'Status', accessor: 'name' },
            { Header: 'Count', accessor: 'value' }
          ],
          chartType: 'pie',
          chartDataKey: 'value'
        };

      case 'contentPerformance':
        return {
          columns: [
            { Header: 'Title', accessor: 'title' },
            { Header: 'Author', accessor: 'author' },
            { Header: 'Access Level', accessor: 'access_level' },
            { Header: 'Status', accessor: 'status' },
            { Header: 'Upload Date', accessor: 'upload_date' },
            { Header: 'Views', accessor: 'views' },
            { Header: 'Downloads', accessor: 'downloads' },
            { Header: 'Engaged Views', accessor: 'engaged_views' },
            { Header: 'Engagement Rate (%)', accessor: 'engagement_completion_rate' },
            { Header: 'Download Rate (%)', accessor: 'download_completion_rate' },
            { Header: 'Format', accessor: 'file_format' }
          ],
          chartType: null
        };

      case 'retentionRate':
        return {
          columns: [
            { Header: 'Title', accessor: 'title' },
            { Header: 'Author', accessor: 'author' },
            { Header: 'Retention Rate (%)', accessor: 'retention_rate' },
            { Header: 'Returning Users', accessor: 'returning_users' },
            { Header: 'Total Users', accessor: 'total_users' },
            { Header: 'Last Accessed', accessor: 'last_accessed' },
            { Header: 'Format', accessor: 'format' }
          ],
          chartType: null
        };

      case 'frequentAccess':
      case 'underutilized':
        return {
          columns: [
            { Header: 'Title', accessor: 'title' },
            { Header: 'Access Count', accessor: 'access_count' },
            { Header: 'Last Accessed', accessor: 'last_accessed' },
            { Header: 'Type', accessor: 'content_type' }
          ],
          chartType: null
        };

      case 'timeSpent':
        return {
          columns: [
            { Header: 'Title', accessor: 'title' },
            { Header: 'Avg Time', accessor: 'avg_time' },
            { Header: 'Total Time', accessor: 'total_time' },
            { Header: 'Users', accessor: 'users' }
          ],
          chartType: null
        };

      case 'activityStats':
        return {
          columns: [
            { Header: 'Downloads', accessor: 'downloads' },
            { Header: 'Views', accessor: 'views' },
            { Header: 'Uploads', accessor: 'uploads' },
            { Header: 'New Content', accessor: 'newContent' }
          ],
          chartType: null
        };

      default:
        return { columns: [], chartType: null };
    }
  };

  const { columns, chartType, chartDataKey } = getReportConfig();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Content Manager Reports</h1>
        <select
          className="border px-4 py-2 rounded-lg"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="recentUploads">⏱️ Recent Upload Contents</option>
          <option value="statusOverview">🟢 Content Status Overview</option>
          <option value="contentPerformance">📊 Content Performance</option>
          <option value="retentionRate">📈 Retention Rate Analysis</option>
          <option value="frequentAccess">⭐ Frequently Accessed</option>
          <option value="underutilized">📉 Underutilized Resources</option>
          <option value="timeSpent">⏳ Time Spent on Resources</option>
          <option value="activityStats">📊 Activity Stats</option>
        </select>
      </div>

      {loading && (
        <div className="bg-white p-6 text-center">Loading...</div>
      )}

      {error && (
        <div className="bg-white p-6 text-center text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <div ref={printRef}>
          <h2 className="text-xl font-semibold mb-4 capitalize">{reportType.replace(/([A-Z])/g, ' $1')}</h2>

          {chartType === 'pie' && (
            <div style={{ height: '400px', marginBottom: '20px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey={chartDataKey}
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={120}
                    label
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {columns.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
              <Table columns={columns} data={data} />
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex justify-end items-center gap-4 no-print">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-blue-700 text-white'
                }`}
              >
                Previous
              </button>
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-blue-700 text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="mt-6 flex gap-4 no-print">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <FaFileCsv /> Export as CSV
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                <FaFilePdf /> Print PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentManagerReport;