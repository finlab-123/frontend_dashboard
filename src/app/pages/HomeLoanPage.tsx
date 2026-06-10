import { Home, TrendingUp, Users } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { LeadsTable } from '../components/LeadsTable';
import { useDashboardStats } from '../hooks/useDashboardStats';
import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';

interface HomeLoanStats {
  total: number;
  approved: number;
  pending: number;
  avgAmount: number;
}

export function HomeLoanPage() {
  const { stats, loading: globalLoading, error: globalError } = useDashboardStats();
  const [homeLoanStats, setHomeLoanStats] = useState<HomeLoanStats>({
    total: 0,
    approved: 0,
    pending: 0,
    avgAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeLoanStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getLeadsByCategory('Home Loan');
        const leads = response.data || [];


        const approved = leads.filter((l: any) => l.status === 'Approved').length;
        const pending = leads.filter((l: any) => l.status === 'Pending').length;
        const avgAmount = leads.length > 0
          ? leads.reduce((sum: number, lead: any) => sum + (lead.loanAmount || 0), 0) / leads.length
          : 0;

        setHomeLoanStats({
          total: leads.length,
          approved,
          pending,
          avgAmount,
        });
      } catch (err: any) {
        console.error('Error fetching home loan stats:', err);
        setError(err.message || 'Failed to load home loan statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeLoanStats();
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
          <h3 className="font-semibold mb-2">Error Loading Home Loans</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1 font-bold">Home Loan</h1>
        <p className="text-sm text-gray-600">Track and manage home loan applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Applications"
          value={loading ? '...' : homeLoanStats.total.toLocaleString()}
          change={loading ? 'Loading...' : '+18.7% from last month'}
          isPositive={true}
          icon={Users}
        />
        <StatsCard
          title="Approved Loans"
          value={loading ? '...' : homeLoanStats.approved.toLocaleString()}
          change={loading ? 'Loading...' : '+21.3% from last month'}
          isPositive={true}
          icon={Home}
        />
        <StatsCard
          title="Avg. Loan Amount"
          value={loading ? '...' : `₹${(homeLoanStats.avgAmount / 100000).toFixed(1)}L`}
          change={loading ? 'Loading...' : '+8.4% from last month'}
          isPositive={true}
          icon={TrendingUp}
        />
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-xl text-gray-900 mb-1 font-semibold">Recent Applications</h2>
          <p className="text-sm text-gray-600">Latest home loan applications</p>
        </div>
        <LeadsTable category="Home Loan" />
      </div>
    </div>
  );
}

