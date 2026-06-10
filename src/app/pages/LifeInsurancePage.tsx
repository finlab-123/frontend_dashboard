import { Shield, Users, CheckCircle, TrendingUp } from 'lucide-react';
import React from 'react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';
export function LifeInsurancePage() {
  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="Life Insurance"
        title="Life Insurance"
        description="Manage life insurance policies and leads"
        stats={[
          {
            label: 'Total Policies',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Active Policies',
            key: 'approved',
            icon: CheckCircle,
          },
          {
            label: 'Avg. Coverage Amount',
            key: 'avgAmount',
            icon: TrendingUp,
            format: (value) => `₹${(value / 100000).toFixed(1)}L`,
          },
        ]}
      />
      <div>
        <div className="mb-4">
          <h2 className="text-xl text-gray-900 mb-1">Recent Life Insurance Leads</h2>
          <p className="text-sm text-gray-600">Track and manage policy applications</p>
        </div>
        <LeadsTable category="Life Insurance" />
      </div>
    </div>
  );
}

