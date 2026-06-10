import React from 'react';
import { BookOpen, TrendingUp, Users } from 'lucide-react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';

export function EducationLoanPage() {
  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="Education Loan"
        title="Education Loan"
        description="Track and manage education loan applications"
        stats={[
          {
            label: 'Total Applications',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Approved Loans',
            key: 'approved',
            icon: BookOpen,
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
          <p className="text-sm text-gray-600">Latest education loan applications</p>
        </div>
        <LeadsTable category="Education Loan" />
      </div>
    </div>
  );
}

