import { PieChart, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';

export function MutualFundsPage() {
  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="Mutual Fund"
        title="Mutual Funds"
        description="Track and manage mutual fund investments"
        stats={[
          {
            label: 'Total Investors',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Active Portfolios',
            key: 'approved',
            icon: PieChart,
          },
          {
            label: 'Avg. Investment',
            key: 'avgAmount',
            icon: TrendingUp,
            format: (value) => `₹${(value / 100000).toFixed(1)}L`,
          },
        ]}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl text-gray-900 mb-4 font-semibold">
          Popular Mutual Funds
        </h2>

        <div className="space-y-4">
          {[
            {
              name: 'HDFC Equity Fund',
              category: 'Large Cap',
              returns: '+18.4%',
              aum: '₹12,450 Cr',
            },
            {
              name: 'ICICI Prudential Bluechip',
              category: 'Large Cap',
              returns: '+16.8%',
              aum: '₹10,230 Cr',
            },
            {
              name: 'SBI Small Cap Fund',
              category: 'Small Cap',
              returns: '+22.3%',
              aum: '₹8,560 Cr',
            },
            {
              name: 'Axis Midcap Fund',
              category: 'Mid Cap',
              returns: '+19.7%',
              aum: '₹9,120 Cr',
            },
          ].map((fund, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="text-sm text-gray-900 mb-1 font-semibold">
                  {fund.name}
                </p>

                <p className="text-xs text-gray-600">
                  {fund.category}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-600">
                    Returns (1Y)
                  </p>

                  <p className="text-sm text-green-600">
                    {fund.returns}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-600">AUM</p>

                  <p className="text-sm text-gray-900">
                    {fund.aum}
                  </p>
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Invest
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-4">
          <h2 className="text-xl text-gray-900 mb-1 font-semibold">
            Recent Mutual Fund Leads
          </h2>

          <p className="text-sm text-gray-600">
            Live mutual fund application status
          </p>
        </div>

        <LeadsTable category="Mutual Fund" />
      </div>
    </div>
  );
}