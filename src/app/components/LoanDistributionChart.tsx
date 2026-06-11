import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Ensure your API_CONFIG matches your actual backend URL
const API_BASE = "https://bynd-backend-owi6.onrender.com";

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

interface ChartItem {
  name: string;
  value: number;
}

export function LoanDistributionChart({ chartData }: { chartData: ChartItem[] }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-[300px] flex flex-col justify-center items-center text-gray-400">
        <p className="text-sm font-medium">No distribution data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-gray-900 font-semibold text-lg mb-1">Loan Distribution</h3>
        <p className="text-sm text-gray-500">Current portfolio breakdown</p>
      </div>

      <div className="flex items-center gap-8">
        <ResponsiveContainer width="60%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 space-y-3">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Corrected the fetch URL here
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();

        console.log("Stats API Response:", body);
        setStats(body);
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard layout...</div>;
  if (error) return <div className="p-8 text-red-600">Error loading dashboard: {error}</div>;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="text-xs text-gray-500 font-medium uppercase">Total Leads</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats?.total ?? 0}</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="text-xs text-amber-600 font-medium uppercase">Pending</div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{stats?.pending ?? 0}</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="text-xs text-blue-600 font-medium uppercase">In Progress</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{stats?.inProgress ?? 0}</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="text-xs text-green-600 font-medium uppercase">Approved</div>
          <div className="text-2xl font-bold text-green-700 mt-1">{stats?.approved ?? 0}</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-xl">
          <div className="text-xs text-red-600 font-medium uppercase">Rejected</div>
          <div className="text-2xl font-bold text-red-700 mt-1">{stats?.rejected ?? 0}</div>
        </div>
      </div>

      <div className="max-w-xl">
        <LoanDistributionChart chartData={stats?.distribution || []} />
      </div>
    </div>
  );
}