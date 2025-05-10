import React, { useEffect, useState } from 'react';
import Table from './components/table';

const columns = [
  {
    header: 'Title',
    accessorKey: 'title',
    enableColumnFilter: false,
  },
  {
    header: 'Description',
    accessorKey: 'description',
    enableColumnFilter: false,
  },
  {
    header: 'Published At',
    accessorKey: 'publishedAt',
    enableColumnFilter: false,
    cell: ({ getValue }) => {
      const date = new Date(getValue());
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
];

export default function App() {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (query = '') => {
    setLoading(true);
    try {
      const url = query
        ? `http://localhost:3000/api/v1/videos/search?q=${encodeURIComponent(query)}`
        : `http://localhost:3000/api/v1/videos`;
      console.log('Fetching data from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data);
      setTableData(data.videos);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Video Table</h1>

      <input
        type="text"
        placeholder="Search videos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full border border-gray-300 px-4 py-2 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <Table tableData={tableData} columns={columns} />
      )}
    </div>
  );
}
