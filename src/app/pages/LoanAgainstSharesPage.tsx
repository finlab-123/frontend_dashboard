import { TrendingUp, Users, BarChart3 } from 'lucide-react';
import React from 'react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';

export function LoanAgainstSharesPage() {
  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="Loan Against Share"
        title="Loan Against Shares"
        description="Track and manage loan against shares applications"
        stats={[
          {
            label: 'Total Applications',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Approved Loans',
            key: 'approved',
            icon: BarChart3,
          },
          {
            label: 'Avg. Loan Amount',
            key: 'avgAmount',
            icon: TrendingUp,
            format: (value) => `₹${(value / 100000).toFixed(1)}L`,
          },
        ]}
      />

      <div>
        <div className="mb-4">
          <h2 className="text-xl text-gray-900 mb-1">Recent Applications</h2>
          <p className="text-sm text-gray-600">Latest loan against shares applications</p>
        </div>
        <LeadsTable category="Loan Against Share" />
      </div>
    </div>
  );
}

