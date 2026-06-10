import React, { useEffect, useState } from 'react';
import { Car, TrendingUp, Users } from 'lucide-react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { LeadsTable } from '../components/LeadsTable';
import { API_CONFIG, apiCall } from '../config/apiConfig';

export function VehicleLoanPage() {
  // Define state simply with the initial values
  const [statsData, setStatsData] = useState({
    total: 0,
    approved: 0,
    avgAmount: 0
  });

  const fetchVehicleStats = async () => {
    // Ensure this URL matches your backend route
    const res = await apiCall(`${API_CONFIG.BASE_URL}/api/loans/vehicle-loan`);
    
    if (res.success && res.data) {
      setStatsData(res.data);
    } else {
      console.error("API Error:", res.error);
    }
  };

  useEffect(() => {
    fetchVehicleStats();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="vehicle-loan"
        title="Vehicle Loan"
        description="Track and manage vehicle loan applications"
        data={statsData}
        stats={[
          {
            label: 'Total Applications',
            key: 'total',
            icon: Users,
          },
          {
            label: 'Approved Loans',
            key: 'approved',
            icon: Car,
          },
          {
            label: 'Avg. Loan Amount',
            key: 'avgAmount',
            icon: TrendingUp,
            format: (value: number) => `₹${(value / 100000).toFixed(1)}L`,
          },
        ]}
      />

      <div>
        <div className="mb-4">
          <h2 className="text-xl text-gray-900 mb-1 font-semibold">
            Recent Applications
          </h2>
          <p className="text-sm text-gray-600">
            Latest vehicle loan applications
          </p>
        </div>

        <LeadsTable category="vehicle-loan" />
      </div>
    </div>
  );
}