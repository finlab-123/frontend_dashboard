import { StatsCard } from '../components/StatsCard';
import { LeadGenerationChart } from '../components/LeadGenerationChart';
import { LoanDistributionChart } from '../components/LoanDistributionChart';
import { LeadsTable } from '../components/LeadsTable';
import { Users, UserCheck, Clock, CheckCircle } from 'lucide-react';
import React from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useMonthlyLeads } from '../hooks/useMonthlyLeads';

export function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: monthlyData, loading: monthlyLoading, error: monthlyError } = useMonthlyLeads();

  const handleRefresh = () => {
    refetchStats();
  };

  if (statsError) {
    return (
      <div className="p-8 space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <h3 className="font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-sm mb-4">{statsError}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1 font-bold">Dashboard Overview</h1>
          <p className="text-sm text-gray-600">Monitor key metrics and lead performance</p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
          disabled={statsLoading}
        >
          {statsLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Leads"
          value={statsLoading ? '...' : (stats?.total ?? 0).toLocaleString()}
          change={statsLoading ? 'Loading...' : '+12.5% from last month'}
          isPositive={true}
          icon={Users}
        />
        <StatsCard
          title="Pending Leads"
          value={statsLoading ? '...' : (stats?.pending ?? 0).toLocaleString()}
          change={statsLoading ? 'Loading...' : '+8.2% from last month'}
          isPositive={true}
          icon={UserCheck}
        />
        <StatsCard
          title="In Progress"
          value={statsLoading ? '...' : (stats?.inProgress ?? 0).toLocaleString()}
          change={statsLoading ? 'Loading...' : '-3.4% from last month'}
          isPositive={false}
          icon={Clock}
        />
        <StatsCard
          title="Approved Loans"
          value={statsLoading ? '...' : (stats?.approved ?? 0).toLocaleString()}
          change={statsLoading ? 'Loading...' : '+18.7% from last month'}
          isPositive={true}
          icon={CheckCircle}
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadGenerationChart 
          data={monthlyData || []}
          loading={monthlyLoading}
          error={monthlyError}
        />
        <LoanDistributionChart chartData={stats?.distribution || []} />
      </div>

      {}
      <div>
        <div className="mb-4">
          <h2 className="text-xl text-gray-900 mb-1 font-bold">Recent Leads</h2>
          <p className="text-sm text-gray-600">Latest lead activity and status</p>
        </div>
        <LeadsTable />
      </div>
    </div>
  );
}

