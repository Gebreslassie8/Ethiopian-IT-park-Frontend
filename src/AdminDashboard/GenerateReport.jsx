import React, { useEffect, useState, useRef } from 'react';
import Table from '../Components/table/Table';
import { FaFileCsv, FaFilePdf } from 'react-icons/fa';
import {PieChart, Pie, Cell, ResponsiveContainer,Tooltip, Legend} from 'recharts';

const GenerateReport = () => {
  const [reportType, setReportType] = useState('contentPerformance');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const endpointMap = {
          statusOverview: 'statusOverview'
        };
        const endpoint = endpointMap[reportType] || reportType;
        
        const response = await fetch(
          `http://localhost:3000/api/admin-reports/${endpoint}?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token || ''}`,
            },
          }
        );
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch ${reportType} report: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
        
        const result = await response.json();
        
        // Ensure each item has a unique ID
        const processedData = Array.isArray(result.data) 
          ? result.data.map((item, index) => ({
              ...item,
              id: item.id || `${reportType}-${page}-${index}-${Date.now()}`
            }))
          : [];
        
        setData(processedData);
        setTotalPages(Math.ceil((result.total || 0) / limit));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [reportType, page, limit]);

  const exportCSV = () => {
    if (!Array.isArray(data) || data.length === 0) return;

    const csvContent = [
      Object.keys(data[0]).join(','),
      ...data.map(row =>
        Object.values(row)
          .map(value => (typeof value === 'object' ? JSON.stringify(value) : value))
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups for this site to use the print feature.');
      return;
    }

    const printContent = `
      <html>
        <head>
          <title>${reportType} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            .report-meta { margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .chart-container { margin: 20px 0; }
            @media print {
              body { margin: 0.5cm; padding: 0; }
              .no-print { display: none; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
              thead { display: table-header-group; }
              tfoot { display: table-footer-group; }
            }
            @page { size: auto; margin: 5mm; }
          </style>
        </head>
        <body>
          <h1>${reportType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Report</h1>
          <div class="report-meta">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Records: ${data.length}</p>
          </div>
          ${printRef.current.innerHTML}
          <script>
            setTimeout(() => {
              window.print();
              window.onafterprint = () => setTimeout(() => window.close(), 300);
            }, 200);
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const getColumns = () => {
    const baseColumns = [];
    
    // Add ID column if it exists in data
    if (data.length > 0 && data[0].id) {
      baseColumns.push({
        Header: 'ID',
        accessor: 'id',
        key: 'id-col',
        show: false
      });
    }

    switch (reportType) {
      case 'contentPerformance':
        return [
          ...baseColumns,
          { Header: 'Title', accessor: 'title', key: 'title-col' },
          { Header: 'Author', accessor: 'author', key: 'author-col' },
          { Header: 'Downloads', accessor: 'downloads', key: 'downloads-col' },
          { Header: 'Views', accessor: 'views', key: 'views-col' },
          { Header: 'Access Level', accessor: 'access_level', key: 'access-level-col' },
          { Header: 'Status', accessor: 'status', key: 'status-col' },
          { Header: 'Upload Date', accessor: 'upload_date', key: 'upload-date-col' },
          { Header: 'Engaged Views', accessor: 'engaged_views', key: 'engaged-views-col' },
          { Header: 'Engagement Rate (%)', accessor: 'engagement_completion_rate', key: 'engagement-rate-col' },
          { Header: 'Download Rate (%)', accessor: 'download_completion_rate', key: 'download-rate-col' },
          { Header: 'Format', accessor: 'format', key: 'format-col' },
        ];

      case 'retentionRate':
        return [
          ...baseColumns,
          { Header: 'Title', accessor: 'title', key: 'title-col' },
          { Header: 'Author', accessor: 'author', key: 'author-col' },
          { Header: 'Retention Rate (%)', accessor: 'retention_rate', key: 'retention-rate-col' },
          { Header: 'Returning Users', accessor: 'returning_users', key: 'returning-users-col' },
          { Header: 'Total Users', accessor: 'total_users', key: 'total-users-col' },
          { Header: 'Last Accessed', accessor: 'last_accessed', key: 'last-accessed-col' },
          { Header: 'Format', accessor: 'format', key: 'format-col' }
        ];

      case 'users':
        return [
          ...baseColumns,
          { Header: 'Username', accessor: 'username', key: 'username-col' },
          { Header: 'Action', accessor: 'action', key: 'action-col' },
          { Header: 'Content', accessor: 'content', key: 'content-col' },
          { Header: 'Interaction Time', accessor: 'interaction_time', key: 'interaction-time-col' },
          { Header: 'Duration', accessor: 'duration', key: 'duration-col' },
        ];

      case 'categories':
        return [
          ...baseColumns,
          { Header: 'Category Name', accessor: 'categoryName', key: 'category-name-col' },
          { Header: 'Usage Count', accessor: 'usageCount', key: 'usage-count-col' },
        ];

      case 'frequentAccess':
      case 'underutilized':
        return [
          ...baseColumns,
          { Header: 'Title', accessor: 'title', key: 'title-col' },
          { Header: 'Access Count', accessor: 'accessCount', key: 'access-count-col' },
          { Header: 'Last Accessed', accessor: 'lastAccessed', key: 'last-accessed-col' },
          { Header: 'Content Type', accessor: 'contentType', key: 'content-type-col' },
        ];

      case 'timeSpent':
        return [
          ...baseColumns,
          { Header: 'Title', accessor: 'title', key: 'title-col' },
          { Header: 'Average Time', accessor: 'averageTime', key: 'average-time-col' },
          { Header: 'Total Time', accessor: 'totalTime', key: 'total-time-col' },
          { Header: 'Unique Users', accessor: 'users', key: 'users-col' },
        ];

 case 'activityStats':
  return [
    ...baseColumns,
    { 
      Header: 'Downloads', 
      accessor: 'downloads', 
      key: 'downloads-col',
    
    },
    { 
      Header: 'Views', 
      accessor: 'views', 
      key: 'views-col',
    
    },
    { 
      Header: 'Uploads', 
      accessor: 'uploads', 
      key: 'uploads-col',
      
    },
    { 
      Header: 'Active Users', 
      accessor: 'activeUsers', 
      key: 'active-users-col',
      
    },
    { 
      Header: 'Engaged Users',  // Changed from "Recently Active"
      accessor: 'engagedUsers', // Changed from "recentlyActiveUsers"
      key: 'engaged-users-col', // Updated key
      
    },
    { 
      Header: 'New Content', 
      accessor: 'newContent', 
      key: 'new-content-col',
     
    }
  ];

      case 'statusOverview':
        return [
          ...baseColumns,
          { Header: 'Status', accessor: 'name', key: 'status-col' },
          { Header: 'Count', accessor: 'value', key: 'count-col' }
        ];

      default:
        return [...baseColumns];
    }
  };

  const getChartConfig = () => {
    if (reportType === 'statusOverview') {
      return {
        chartType: 'pie',
        chartDataKey: 'value'
      };
    }
    return { chartType: null };
  };

  const { chartType, chartDataKey } = getChartConfig();

  const goToPrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Generate Reports</h1>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={reportType}
          onChange={e => {
            setPage(1);
            setReportType(e.target.value);
          }}
        >
          <option value="contentPerformance">📊 Content Performance</option>
          <option value="retentionRate">📈 Retention Rate Analysis</option>
          <option value="users">👤 User Activities</option>
          <option value="categories">📂 Category Usage</option>
          <option value="statusOverview">🟢 Content Status Overview</option>
          <option value="frequentAccess">⭐ Frequently Accessed</option>
          <option value="underutilized">📉 Underutilized Resources</option>
          <option value="timeSpent">⏱️ Time Spent on Resources</option>
          <option value="activityStats">📊 Activity Stats</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-lg">Loading report data...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
        </div>
      ) : Array.isArray(data) && data.length > 0 ? (
        <>
          <div ref={printRef}>
            {chartType === 'pie' && (
              <div className="chart-container" style={{ height: '400px', marginBottom: '20px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey={chartDataKey}
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {data.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color || '#8884d8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table 
                columns={getColumns()} 
                data={data}
                getRowId={(row) => row.id}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FaFileCsv className="text-lg" /> Export as CSV
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FaFilePdf className="text-lg" /> Print Report
            </button>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-end items-center gap-4">
              <button
                onClick={goToPrevPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-blue-700 text-white'
                }`}
              >
                Previous
              </button>
              <span className="font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg ${
                  page === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-blue-700 text-white'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-lg">No report data available for the selected report type.</p>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;