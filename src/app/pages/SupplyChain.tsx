import React from 'react';
import { Truck, Boxes, FileCheck, TrendingUp, Users } from 'lucide-react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';

export function SupplyChainLoanPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {}
      <ProductStatsDisplay
        category="Supply Chain"
        title="Supply Chain"
        description="Monitor invoice discounting, vendor financing, and working capital application pipelines"
        stats={[
          {
            label: 'Total Applications',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Approved Capital',
            key: 'approved',
            icon: FileCheck,
          },
          {
            label: 'Active Logistics Pool',
            key: 'pending',
            icon: Truck,
          },
          {
            label: 'Avg. Disbursement',
            key: 'avgAmount',
            icon: TrendingUp,
            format: (value: number) => `₹${(value / 100000).toFixed(1)}L`,
          },
        ]}
      />

      {}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Available Corporate Programs</h2>
          <p className="text-sm text-gray-500">Working capital solutions optimized for vendors and distributors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:border-blue-500 transition-all duration-200">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <Boxes className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Invoice Discounting</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Convert unpaid enterprise client invoices into instant operational cash injections within 24–48 hours.
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:border-blue-500 transition-all duration-200">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Vendor Financing</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ensure continuous early payouts to suppliers based on credit limits validated by anchor corporate metrics.
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:border-blue-500 transition-all duration-200">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Dealer Credit Lines</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Empower downstream retail networks with revolving inventory financing lines to clear supply constraints.
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Recent Supply Chain Applications</h2>
          <p className="text-sm text-gray-500">Monitor live supplier credit audits, vendor validations, and settlement tracking</p>
        </div>
        
        {}
        <LeadsTable category="Supply Chain" />
      </div>
    </div>
  );
}
