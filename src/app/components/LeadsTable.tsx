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
  date: string;
  amount?: string;
}

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Approved: 'bg-green-50 text-green-700 border-green-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
};

export function LeadsTable({ category }: { category?: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
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

        if (d.assignedTo) {
          try {
            const agentRes = await fetch(`${API_CONFIG.BASE_URL}/api/team-assign/assigned/${d._id}`);
            if (agentRes.ok) {
              const agentData = await agentRes.json();
              if (agentData.success && agentData.data?.assignedTo?.fullname) {
                assignedToName = agentData.data.assignedTo.fullname;
                console.log(`Fetched agent name for lead ${d._id}: ${assignedToName}`); // Debug log
              }
            }
          } catch (e) {
            assignedToName = `Agent (${String(d.assignedTo).substring(0, 8)}...)`;
          }
        }
        const amountValue =
          d.loanAmount ||
          d.requiredLoanAmount ||
          d.amountRange ||
          d.amountrange ||
          d.amount ||
          d.desiredamount ||
          0;

        return {
          id: d._id,
          name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || '—',
          contact: d.phone || d.mobile || d.email || '—',
          loanType: d.productCategory || '—',
          status: d.status || 'Pending',
          assignedToName,
          date: d.createdAt ? format(new Date(d.createdAt), 'dd MMM yyyy') : '—',
          amount: amountValue
            ? new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR'
            }).format(Number(amountValue))
            : '—',
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

  const handleStatusChange = async (leadId: string, newStatus: string, e: React.SyntheticEvent) => {
    e.stopPropagation();

    if (!newStatus) return;

    try {
      setUpdatingId(leadId);
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/dashboard/lead-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          status: newStatus
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
        setToast({ type: 'success', message: `Status updated to ${newStatus}` });
        setTimeout(() => setToast(null), 3000);
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Error updating status' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading leads...</div>;
  if (error) return <div className="p-8 text-red-600 text-center">Error: {error}</div>;

  return (
    <>
      {toast && (
        <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg text-white font-semibold text-sm ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } shadow-lg animate-bounce z-50`}>
          {toast.message}
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600 border-b">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Loan Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Assigned To</th>
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
                <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {lead.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.contact}</td>
                <td className="px-6 py-4 font-medium">{lead.loanType}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{lead.amount || '—'}</td>
                <td className="px-6 py-4">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value, e)}
                    disabled={updatingId === lead.id}
                    onClick={(e) => e.stopPropagation()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all ${statusStyles[lead.status] || 'bg-gray-100 text-gray-600'}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Approved">Approved</option>
                  </select>
                </td>
                <td className="px-6 py-4 font-bold text-blue-700">
                  {lead.assignedToName || '—'}
                </td>
                <td className="px-6 py-4 text-gray-500">{lead.date}</td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}