import { Building2, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';

export function LAPPage() {
  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="Loan Against Property"
        title="Loan Against Property"
        description="Track and manage loan against property applications"
        stats={[
          {
            label: 'Total Applications',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Approved Loans',
            key: 'approved',
            icon: Building2,
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
          <h2 className="text-xl text-gray-900 mb-1 font-semibold">Recent Applications</h2>
          <p className="text-sm text-gray-600">Latest LAP applications</p>
        </div>
        <LeadsTable category="Loan Against Property" />
      </div>
    </div>
  );
}

