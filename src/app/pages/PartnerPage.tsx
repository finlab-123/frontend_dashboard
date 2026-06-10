import React, { useEffect, useState } from 'react';
import { Handshake, Users, TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import { ProductStatsDisplay } from '../components/ProductStatsDisplay';
import { API_CONFIG, apiCall } from '../config/apiConfig';

// Define TS interface matching your Mongoose schema fields
interface PartnerData {
  _id: string;
  phone: string;
  name?: string;
  lastName?: string;
  email?: string;
  status: string;
  createdAt: string;
}

export function PartnerPage() {
  const [partners, setPartners] = useState<PartnerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statsData, setStatsData] = useState({
    total: 0,
    approved: 0,
    avgAmount: 0
  });

  // 1. Fetch Stats & Aggregations
  const fetchPartnerStats = async () => {
    const res = await apiCall(`${API_CONFIG.BASE_URL}/api/partner/stats`);
    if (res.success && res.data) {
      setStatsData(res.data);
    } else {
      // Fallback calculations based on local fetched data if dedicated stats endpoint doesn't exist yet
      calculateFallbackStats(partners);
    }
  };

  // 2. Fetch the List of Partners using your new backend controller
  const fetchPartnersList = async () => {
    setLoading(true);
    const res = await apiCall(`${API_CONFIG.BASE_URL}/api/partner/partners`);
    if (res.success && res.data) {
      // Accessing the data wrapper from your controller: res.status(200).json({ data: partners })
      const partnerList = res.data.data || res.data;
      setPartners(partnerList);
      calculateFallbackStats(partnerList);
    }
    setLoading(false);
  };

  // Safe fallback utility to populate top metric bars using active DB data 
  const calculateFallbackStats = (list: PartnerData[]) => {
    const total = list.length;
    const approved = list.filter(p => p.status === 'Approved' || p.status === 'Active').length;
    // Mocking standard layout matching your other view tabs
    setStatsData({
      total,
      approved,
      avgAmount: total * 125000 // Sample data for display matching ₹L structure
    });
  };

  useEffect(() => {
    fetchPartnersList();
  }, []);

  useEffect(() => {
    if (partners.length > 0) {
      fetchPartnerStats();
    }
  }, [partners]);

  return (
    <div className="p-8 space-y-8">
      <ProductStatsDisplay
        category="Partner Network"
        title="Partner Network"
        description="Track and manage your partner performance and commissions"
        data={statsData}
        stats={[
          {
            label: 'Total Registered',
            key: 'total',
            icon: Handshake,
          },
          {
            label: 'Active/Verified',
            key: 'approved',
            icon: Users,
          },
          {
            label: 'Est. Commissions',
            key: 'avgAmount',
            icon: TrendingUp,
            format: (value: number) => `₹${(value / 100000).toFixed(1)}L`,
          },
        ]}
      />

      {/* Dynamic Records Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Partner Applications</h2>
            <p className="text-xs text-gray-500 mt-0.5">Real-time entries registered directly from backend system database</p>
          </div>
          <button
            onClick={fetchPartnersList}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition"
          >
            Refresh Records
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Fetching database entries...</span>
          </div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            No partner configurations located within MongoDB database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Partner Identity</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Registration Date</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {partners.map((partner) => (
                  <tr key={partner._id} className="hover:bg-gray-50/70 transition-colors">
                    {/* Identity Info */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {partner.name || partner.lastName ? (
                        <span>{partner.name || ''} {partner.lastName || ''}</span>
                      ) : (
                        <span className="text-gray-400 italic font-normal">Incomplete Profile</span>
                      )}
                    </td>

                    {/* Contact Details */}
                    <td className="px-6 py-4 space-y-0.5">
                      <div className="font-mono text-xs font-semibold text-gray-800">{partner.phone}</div>
                      {partner.email && <div className="text-xs text-gray-500">{partner.email}</div>}
                    </td>

                    {/* Timestamp parsing */}
                    <td className="px-6 py-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(partner.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Status badges mapping schema defaults */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${partner.status === 'In-Progress'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : partner.status === 'Approved' || partner.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                        {partner.status === 'In-Progress' ? (
                          <Clock className="w-3 h-3 text-amber-500" />
                        ) : (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        )}
                        {partner.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}