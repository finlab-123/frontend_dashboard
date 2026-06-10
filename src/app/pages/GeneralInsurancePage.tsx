import { Umbrella, Users, CheckCircle, TrendingUp } from 'lucide-react';
import React from 'react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';


const insuranceProducts = [
  { name: 'Motor Insurance', icon: '🚗', coverage: 'Vehicle damage & third-party', premium: '₹8,000-25,000/year', features: ['Accident cover', 'Theft protection', 'Roadside assistance'] },
  { name: 'Health Insurance', icon: '🏥', coverage: 'Medical expenses & hospitalization', premium: '₹15,000-50,000/year', features: ['Cashless treatment', 'Pre/post hospitalization', 'Daycare procedures'] },
  { name: 'Travel Insurance', icon: '✈️', coverage: 'Trip cancellation & emergencies', premium: '₹500-5,000/trip', features: ['Flight delay', 'Lost baggage', 'Medical emergencies'] },
  { name: 'Home Insurance', icon: '🏠', coverage: 'Property & contents damage', premium: '₹5,000-20,000/year', features: ['Fire & theft', 'Natural disasters', 'Public liability'] },
];

export function GeneralInsurancePage() {
  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="General Insurance"
        title="General Insurance"
        description="Comprehensive insurance solutions for every need"
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
          <h2 className="text-xl text-gray-900 mb-1">Recent General Insurance Leads</h2>
          <p className="text-sm text-gray-600">Track and manage policy applications</p>
        </div>
        <LeadsTable category="General Insurance" />
      </div>
    </div>
  );
}

