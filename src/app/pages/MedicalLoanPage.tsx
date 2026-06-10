import { Heart, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';

export function MedicalLoanPage() {
  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="Medical Loan"
        title="Medical Loan"
        description="Track and manage medical loan applications"
        stats={[
          {
            label: 'Total Applications',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Approved Loans',
            key: 'approved',
            icon: Heart,
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
          <p className="text-sm text-gray-600">Latest medical loan applications</p>
        </div>
        <LeadsTable category="Medical Loan" />
      </div>
    </div>
  );
}

