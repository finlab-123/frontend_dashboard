import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  contact: string;
  loanType: string;
  status: string;
  assignedTo?: string;
  date: string;
  amount?: string;
}

interface Agent {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
}

const API_BASE = "https://bynd-backend-owi6.onrender.com/api";

export function AssignLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [submittingAgent, setSubmittingAgent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedAgentIdForBulk, setSelectedAgentIdForBulk] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentmobile, setNewAgentmobile] = useState('');

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/dashboard/allleads`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const body = await res.json();
      const rawLeads = body.data || body || [];

      const mapped: Lead[] = rawLeads.map((d: any) => ({
        id: d._id,
        name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || '—',
        contact: d.phone || d.mobile || d.email || '—',
        loanType: d.productCategory || '—',
        status: d.status || 'Pending',
        assignedTo: d.assignedTo || '',
        date: d.createdAt ? format(new Date(d.createdAt), 'dd MMM yyyy') : '—',
        amount: d.loanAmount
          ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(d.loanAmount)
          : undefined,
      }));

      setLeads(mapped);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Agents
  const fetchAgents = async () => {
    try {
      setLoadingAgents(true);
      const res = await fetch(`${API_BASE}/team-assign`);
      if (!res.ok) throw new Error('Failed to fetch agents');

      const body = await res.json();
      setAgents(Array.isArray(body.data) ? body.data : []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load team members');
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(prev =>
      prev.includes(id) ? prev.filter(leadId => leadId !== id) : [...prev, id]
    );
  };

  const filteredLeads = leads.filter(lead => {
    // hide assigned leads
    if (lead.assignedTo && lead.assignedTo.trim() !== '') {
      return false;
    }

    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !categoryFilter || lead.loanType === categoryFilter;

    return matchesSearch && matchesCategory;
  });
  const uniqueCategories = Array.from(new Set(leads.map(l => l.loanType).filter(Boolean)));

  // Add New Agent
  const handleAddAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail || !newAgentmobile) {
      setError("All fields are required");
      return;
    }
    try {
      setSubmittingAgent(true);
      const res = await fetch(`${API_BASE}/team-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname: newAgentName, email: newAgentEmail, phone: newAgentmobile })
      });

      if (!res.ok) throw new Error('Failed to add agent');

      setSuccessMessage("Agent added successfully!");
      setIsModalOpen(false);
      setNewAgentName('');
      setNewAgentEmail('');
      setNewAgentmobile('');
      fetchAgents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmittingAgent(false);
    }
  };

  const handleAssign = async (leadId: string, agentId: string) => {
    if (!agentId) return;

    try {
      setAssigning(true);

      const res = await fetch(`${API_BASE}/dashboard/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teamId: agentId,
          projectId: leadId
        })
      });

      if (!res.ok) {
        throw new Error('Assignment failed');
      }

      setSuccessMessage("Lead assigned successfully");

      // remove assigned lead instantly from UI
      setLeads(prev =>
        prev.filter(lead => lead.id !== leadId)
      );

    } catch (err: any) {
      setError(err.message);
    } finally {
      setAssigning(false);
    }
  };

  const handleAssignBulk = async () => {
    if (!selectedAgentIdForBulk || selectedLeads.length === 0) {
      return;
    }

    try {
      setAssigning(true);

      await Promise.all(
        selectedLeads.map(id =>
          fetch(`${API_BASE}/dashboard/assign`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              teamId: selectedAgentIdForBulk,
              projectId: id
            })
          })
        )
      );

      setSuccessMessage(
        `Successfully assigned ${selectedLeads.length} leads`
      );

      // instantly remove assigned leads from UI
      setLeads(prev =>
        prev.filter(
          lead => !selectedLeads.includes(lead.id)
        )
      );

      setSelectedLeads([]);

    } catch (err: any) {
      setError("Some assignments failed");
    } finally {
      setAssigning(false);
    }
  };
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assign Leads Matrix</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-black"
        >
          <Plus className="w-4 h-4" /> Add New employeeType
        </button>
      </div>

      {successMessage && <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 p-4 rounded-xl">{successMessage}</div>}
      {error && <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-xl">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 flex flex-wrap gap-4 items-center border-b">
          <input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-4 py-2.5 rounded-lg text-sm w-80 focus:outline-none focus:border-blue-500"
          />

          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-4 py-2.5 rounded-lg text-sm focus:outline-none"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {selectedLeads.length > 0 && (
            <div className="flex items-center gap-3 ml-auto">
              <select
                onChange={(e) => setSelectedAgentIdForBulk(e.target.value)}
                className="border px-4 py-2.5 rounded-lg text-sm"
              >
                <option value="">Assign to...</option>
                {agents.map(a => (
                  <option key={a._id} value={a._id}>{a.fullname}</option>
                ))}
              </select>
              <button
                onClick={handleAssignBulk}
                disabled={assigning}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50"
              >
                {assigning ? "Assigning..." : `Assign ${selectedLeads.length} Leads`}
              </button>
            </div>
          )}
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4 text-left w-12">Select</th>
              <th className="px-6 py-4 text-left">Applicant</th>
              <th className="px-6 py-4 text-left">Contact</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleLeadSelection(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{lead.name}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.contact}</td>
                  <td className="px-6 py-4">{lead.loanType}</td>
                  <td className="px-6 py-4">
                    <select
                      onChange={(e) => handleAssign(lead.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Assign to...</option>
                      {agents.map(a => (
                        <option key={a._id} value={a._id}>{a.fullname}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Agent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New employeeType</h2>

            <input className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4" placeholder="Full Name" value={newAgentName} onChange={e => setNewAgentName(e.target.value)} />
            <input className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4" placeholder="Email Address" type="email" value={newAgentEmail} onChange={e => setNewAgentEmail(e.target.value)} />
            <input className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6" placeholder="mobile  Number" value={newAgentmobile} onChange={e => setNewAgentmobile(e.target.value)} />

            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-lg font-medium">Cancel</button>
              <button onClick={handleAddAgentSubmit} disabled={submittingAgent} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-70">
                {submittingAgent ? "Adding..." : "Add employeeType"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}