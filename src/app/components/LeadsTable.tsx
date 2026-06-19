import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { API_CONFIG } from '../config/apiConfig';
import { Link, useNavigate } from 'react-router';

interface Lead {
  id: string;
  name: string;
  contact: string;
  loanType: string;
  status: string;
  assignedToName: string;
  lastUpdatedBy: string; 
  date: string;
  amount?: string;
}

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Approved: 'bg-green-50 text-green-700 border-green-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Ringing: 'bg-purple-50 text-purple-700 border-purple-200',
  'Call Back': 'bg-pink-50 text-pink-700 border-pink-200',
  'Documents Verified': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export function LeadsTable({ category }: { category?: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = category
        ? API_CONFIG.DASHBOARD.GET_LEADS_BY_CATEGORY(category)
        : API_CONFIG.DASHBOARD.GET_ALL_LEADS;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body = await res.json();
      const rawLeads = Array.isArray(body) ? body : (body.data || []);

      const processed = await Promise.all(rawLeads.map(async (d: any) => {
        let assignedToName = '—';

        if (d.assignedTo && d.assignedTo.length > 0) {
          try {
            const agentRes = await fetch(`${API_CONFIG.BASE_URL}/api/team-assign/assigned/${d._id}`);
            if (agentRes.ok) {
              const agentData = await agentRes.json();
              if (agentData.success && agentData.data?.assignedTo?.fullname) {
                assignedToName = agentData.data.assignedTo.fullname;
              }
            }
          } catch (e) {
            assignedToName = `Agent (${String(d.assignedTo[0]).substring(0, 8)}...)`;
          }
        }

        let lastUpdatedBy = '—';
        if (d.remarks && d.remarks.length > 0) {
          const latestRemark = d.remarks[d.remarks.length - 1];
          if (latestRemark && latestRemark.author) {
            lastUpdatedBy = latestRemark.author.charAt(0).toUpperCase() + latestRemark.author.slice(1);
          }
        }

        const prodCat = d.productCategory || '';
        const nonAmountCategories = [
          "lifeinsurance", 
          "lifeinsurence", 
          "generalinsurance", 
          "generalinsurence", 
          "mutualfund", 
          "mutual-fund",
          "creditcard", 
          "equity"
        ];

        let displayAmount = '—';
        if (nonAmountCategories.includes(prodCat.toLowerCase().replace(/[\s-_]+/g, ''))) {
          displayAmount = 'Not Required';
        } else {
          const amountValue =
            d.loanAmount ||
            d.requiredLoanAmount ||
            d.amountRange ||
            d.amountrange ||
            d.requiredAmount ||
            d.amount;

          if (amountValue) {
            displayAmount = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(Number(amountValue));
          }
        }

        return {
          id: d._id,
          name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || '—',
          contact: d.phone || d.mobile || d.email || '—',
          loanType: d.productCategory || '—',
          status: d.status || 'Pending',
          assignedToName,
          lastUpdatedBy, 
          date: d.createdAt ? format(new Date(d.createdAt), 'dd MMM yyyy') : '—',
          amount: displayAmount
        };
      }));

      setLeads(processed);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [category]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading leads...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Error: {error}</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
      <table className="w-full text-left table-auto min-w-[1000px]">
        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600 border-b whitespace-nowrap">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Product Category</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Assigned To / Updated By</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {leads.map(lead => (
            <tr
              key={lead.id}
              onClick={() => navigate(`/user/${lead.id}`)}
              className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-indigo-600 transition-colors max-w-[180px] truncate">
                {lead.name}
              </td>
              <td className="px-6 py-4 text-gray-600">{lead.contact}</td>
              <td className="px-6 py-4 font-medium capitalize">{lead.loanType}</td>
              <td className={`px-6 py-4 font-semibold whitespace-nowrap ${lead.amount === 'Not Required' ? 'text-gray-400 font-normal italic text-xs' : 'text-gray-800'}`}>
                {lead.amount}
              </td>
              {/* FIXED: Prevent status badges from wrapping text layout */}
              <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap tracking-wide ${statusStyles[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                  {lead.status}
                </span>
              </td>
              {/* FIXED: Formatted tracking logs to sit clean with no dangling dashes */}
              <td className="px-6 py-4 whitespace-nowrap">
                {lead.assignedToName !== '—' ? (
                  <div className="font-bold text-blue-700">
                    {lead.assignedToName}
                  </div>
                ) : (
                  (!lead.lastUpdatedBy || lead.lastUpdatedBy === '—') && (
                    <div className="font-bold text-gray-400">—</div>
                  )
                )}

                {lead.lastUpdatedBy && lead.lastUpdatedBy !== '—' && (
                  <div className="text-[11px] text-gray-400 font-normal mt-0.5 whitespace-nowrap">
                    Last status update by: <span className="font-medium text-gray-600">{lead.lastUpdatedBy}</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{lead.date}</td>
              <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <Link
                  to={`/user/${lead.id}`}
                  className="inline-flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                >
                  View Profile
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}