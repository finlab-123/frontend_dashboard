import React from 'react';
import { CreditCard, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';

export function CreditCardPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {}
      <ProductStatsDisplay
        category="Credit Card"
        title="Credit Cards"
        description="Manage credit card applications and leads"
        stats={[
          {
            label: 'Total Applications',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Approved Cards',
            key: 'approved',
            icon: CheckCircle,
          },
          {
            label: 'Pending Review',
            key: 'pending',
            icon: CreditCard,
          },
          {
            label: 'Avg. Credit Limit',
            key: 'avgAmount',
            icon: TrendingUp,
            format: (value: number) => `₹${(value / 100000).toFixed(1)}L`,
          },
        ]}
      />

      {}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Recent Credit Card Applications</h2>
          <p className="text-sm text-gray-500">Monitor live application statuses and cross-channel validation processing</p>
        </div>
        <LeadsTable category="Credit Card" />
      </div>

    </div>
  );
}
