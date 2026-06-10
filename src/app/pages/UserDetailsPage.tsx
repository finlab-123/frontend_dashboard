import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Mail,
  mobile,
  Calendar,
  Briefcase,
  MapPin,
  ShieldCheck,
  DollarSign,
  Clock,
  Download,
  UserCheck2,
  AlertCircle,
  Copy,
  CheckCircle,
  TrendingUp,
  FileSpreadsheet,
  Users
} from 'lucide-react';
import { API_CONFIG } from '../config/apiConfig';

interface AssignedAgent {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
}

interface LeadData {
  _id: string;
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  pincode?: string;
  pan?: string;
  aadhar?: string;
  employeeType?: string;
  city?: string;
  state?: string;
  loanAmount?: number;
  annualIncome?: number;
  income?: number;
  productCategory?: string;
  status?: string;
  propertyDescription?: string;
  propertytype?: string;
  marketvalue?: string;
  loantype?: string;
  requiredLoanAmount?: string;
  investIn?: string;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
}

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State Management
  const [user, setUser] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Assignment & Team State
  const [assignedAgent, setAssignedAgent] = useState<AssignedAgent | null>(null);
  const [loadingAgent, setLoadingAgent] = useState(false);
  const [agents, setAgents] = useState<AssignedAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch all details on mount / ID change
  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch User Main Data
        const userUrl = API_CONFIG.DASHBOARD.GET_USER_DETAILS(id);
        const res = await fetch(userUrl);
        if (!res.ok) throw new Error(`Failed to fetch user (HTTP ${res.status})`);

        const resData = await res.json();
        if (resData.success && resData.data) {
          setUser(resData.data);

          // 2. Fetch Assigned Team Info if exists
          if (resData.data._id) {
            fetchAssignedTeam(resData.data._id);
          }
        } else {
          throw new Error(resData.message || 'Unable to fetch user data');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading lead details');
      } finally {
        setLoading(false);
      }
    };

    // Trigger initial load
    fetchAllData();
    fetchAgentsList();
  }, [id]);

  // Fetch assigned agent helper
  const fetchAssignedTeam = async (leadId: string) => {
    try {
      setLoadingAgent(true);
      const agentRes = await fetch(`${API_CONFIG.BASE_URL}/api/dashboard/assigned/${leadId}`);
      if (agentRes.ok) {
        const agentData = await agentRes.json();
        if (agentData.success && agentData.data?.assignedTo) {
          setAssignedAgent(agentData.data.assignedTo);
        } else {
          setAssignedAgent(null);
        }
      }
    } catch (e) {
      console.error('Error fetching assigned agent:', e);
    } finally {
      setLoadingAgent(false);
    }
  };

  // Fetch agents dropdown helper
  const fetchAgentsList = async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/team-assign`);
      if (res.ok) {
        const data = await res.json();
        setAgents(Array.isArray(data.data) ? data.data : []);
      }
    } catch (e) {
      console.error('Error fetching employeeType list:', e);
    }
  };

  // Assign lead to selected agent
  const handleAssignAgent = async () => {
    if (!id || !selectedAgentId) return;

    try {
      setAssigning(true);
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/dashboard/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: selectedAgentId,
          projectId: id
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('success', 'Lead assigned successfully to employeeType');
        fetchAssignedTeam(id);
        setSelectedAgentId('');
      } else {
        throw new Error(data.message || 'Failed to complete assignment');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Could not assign employeeType');
    } finally {
      setAssigning(false);
    }
  };

  // Update lead status
  const handleStatusChange = async (status: string) => {
    if (!id || !status || status === user?.status) return;

    try {
      setStatusUpdating(true);
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/dashboard/lead-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: id,
          status
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(prev => prev ? { ...prev, status } : null);
        showToast('success', `Lead status updated to ${status}`);
        setNewStatus('');
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Could not update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  // Helper to show interactive toast
  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Copy Lead ID to Clipboard
  const handleCopyId = () => {
    if (!user?._id) return;
    navigator.clipboard.writeText(user._id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Generate and Download detailed report as a text file
  const handleDownloadReport = () => {
    if (!user) return;

    const reportContent = `
=========================================
      BYND FINSERVE FINANCIAL REPORT      
=========================================
Generated on  : ${new Date().toLocaleString('en-IN')}
Lead ID       : ${user._id}
Applied Date  : ${user.createdAt ? new Date(user.createdAt).toLocaleString('en-IN') : 'N/A'}
Status        : ${user.status || 'Pending'}

APPLICANT PROFILE:
-----------------
Full Name     : ${user.name || ''} ${user.lastName || ''}
Date of Birth : ${user.dob || 'N/A'}
Gender        : ${user.gender || 'N/A'}
employeeType    : ${user.employeeType || 'N/A'}
Annual Income : ${user.annualIncome ? `INR ${Number(user.annualIncome).toLocaleString('en-IN')}` : 'N/A'}

CONTACT INFORMATION:
-------------------
Email Address : ${user.email || 'N/A'}
Phone Number  : ${user.phone || 'N/A'}
Location      : ${user.city || 'N/A'}, ${user.state || 'N/A'} - ${user.pincode || 'N/A'}

FINANCIAL REQUEST:
-----------------
Category      : ${user.productCategory || 'N/A'}
Loan Type     : ${user.loantype || 'N/A'}
Requested Amt : ${user.loanAmount || user.requiredLoanAmount  ? `INR ${Number(user.loanAmount || user.requiredLoanAmount).toLocaleString('en-IN')}` : 'N/A'}
Amount Range  : ${user.loanAmount || user.requiredLoanAmount || 'N/A'}

OFFICIAL VERIFICATION DOCUMENTS:
-------------------------------
PAN Number    : ${user.pan ? user.pan.toUpperCase() : 'N/A'}
Aadhar Number : ${user.aadhar || 'N/A'}

SYSTEM NOTES:
------------
Assigned Agent: ${assignedAgent ? `${assignedAgent.fullname} (${assignedAgent.email})` : 'Unassigned'}
=========================================
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${user.name || 'Lead'}_${user._id.substring(0, 8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Report downloaded successfully');
  };

  // Styles for badges based on status
  const getStatusStyles = (status: string = 'Pending') => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-700',
          dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
        };
      case 'Pending':
      default:
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="h-44 bg-gray-200 rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-2xl md:col-span-2"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested user could not be found.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-black transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusStyles(user.status);
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No Name Provided';
  const initial = user.firstName?.[0] || user.lastName?.[0] || 'U';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce flex items-center gap-3 bg-gray-900 border border-gray-800 text-white px-5 py-4 rounded-xl shadow-2xl">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-950 transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
          </button>

          <div className="text-xs text-gray-400 font-medium">
            Dashboard / Leads / Lead ID: <span className="font-mono text-gray-600 font-bold">{user._id}</span>
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Accent Background Gradient */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-50/40 via-blue-50/10 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="flex items-center gap-5 sm:gap-6 relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-md border-2 border-indigo-100 flex-shrink-0">
              {initial.toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {fullName}
                </h1>

                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {user.status || 'Pending'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-medium text-gray-500">
                <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md font-semibold text-xs tracking-wider uppercase">
                  {user.productCategory || 'Uncategorized'}
                </span>

                {user.loantype && (
                  <span className="text-gray-400">
                    Type: <strong className="text-gray-700 font-semibold">{user.loantype}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Applied: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex sm:items-center gap-3 flex-wrap relative">
            <button
              onClick={handleDownloadReport}
              className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold px-5 py-3 rounded-xl transition-all shadow-sm active:scale-95 text-sm"
            >
              <Download className="w-4 h-4 text-gray-500" />
              Download Report
            </button>
            <a
              href="#assignment-panel"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-indigo-100 active:scale-95 text-sm"
            >
              <UserCheck2 className="w-4 h-4" />
              Assign Lead
            </a>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details Panel (Col-span 2) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Financial Overview Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Requested Amount</span>
                  <div className="text-2xl font-black text-gray-900">
                    {user.loanAmount || user.requiredLoanAmount
                      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(user.loanAmount || user.requiredLoanAmount)
                      : 'N/A'
                    }
                  </div>
                  {(user.loanAmount || user.requiredLoanAmount) && (
                    <span className="text-xs text-gray-500 font-semibold">Range: {user.loanAmount || user.requiredLoanAmount}</span>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Annual Income</span>
                  <div className="text-2xl font-black text-gray-900">
                    {user.annualIncome
                      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(user.annualIncome)
                      : 'N/A'
                    }
                  </div>
                  <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" /> High-intent applicant
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Profile Grid Cards */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</span>
                    <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">employeeType Status</span>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {user.employeeType || 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Gender</span>
                    <p className="text-sm font-semibold text-gray-900">{user.gender || 'N/A'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Date of Birth</span>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {user.dob || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Email Address</span>
                    <p className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${user.email}`}>{user.email || 'N/A'}</a>
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone Number</span>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <mobile className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${user.phone}`} className="hover:underline">{user.phone || 'N/A'}</a>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                  Official Identity Documents
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">PAN Number</span>
                    <p className="text-sm font-black text-gray-900 tracking-wider flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      {user.pan ? user.pan.toUpperCase() : 'N/A'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Aadhar Number</span>
                    <p className="text-sm font-semibold text-gray-900 tracking-wider flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      {user.aadhar || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                  Residential Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Address</span>
                    <p className="text-sm font-semibold text-gray-900 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>
                        {user.city ? `${user.city}, ` : ''}
                        {user.state ? `${user.state} ` : ''}
                        {user.pincode ? `- ${user.pincode}` : ''}
                        {!user.city && !user.state && !user.pincode && 'No address details provided'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Conditional sections based on category */}
              {(user.propertytype || user.marketvalue || user.investIn) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">
                    Product Specific Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    {(user.propertyDescription || user.propertytype) && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Property Description</span>
                        <p className="text-sm font-semibold text-gray-900">{user.propertyDescription || user.propertytype}</p>
                      </div>
                    )}

                    {user.marketvalue && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Market Value</span>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{Number(user.marketvalue).toLocaleString('en-IN') || user.marketvalue}
                        </p>
                      </div>
                    )}

                    {user.investIn && (
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Investment Strategy</span>
                        <p className="text-sm font-semibold text-gray-900">{user.investIn}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info & Controls (Col-span 1) */}
          <div className="space-y-6">

            {/* Lead Metadata Info Box */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">System Metadata</h3>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Lead ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-800 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl block flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user._id}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 hover:text-gray-800 transition active:scale-95 flex-shrink-0"
                      title="Copy ID"
                    >
                      {copiedId ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Created At</span>
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {user.createdAt ? new Date(user.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>

                {user.updatedAt && (
                  <div className="space-y-1.5 border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Last Updated</span>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(user.updatedAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Management Panel */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" /> Application Status
              </h3>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Current Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${getStatusStyles(user?.status).bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyles(user?.status).dot}`} />
                  {user?.status || 'Pending'}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                  Update Status
                </label>

                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={statusUpdating}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Select Status...</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Approved">Approved</option>
                </select>

                <button
                  onClick={() => handleStatusChange(newStatus)}
                  disabled={statusUpdating || !newStatus || newStatus === user?.status}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 active:scale-95 shadow-sm disabled:cursor-not-allowed"
                >
                  {statusUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>

            {/* employeeType Assignment Panel */}
            <div id="assignment-panel" className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" /> Team Delegation
              </h3>

              {/* Currently Assigned Person */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Currently Assigned To</span>

                {loadingAgent ? (
                  <div className="text-xs text-gray-500 animate-pulse">Loading assignment...</div>
                ) : assignedAgent ? (
                  <div className="space-y-2">
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <UserCheck2 className="w-4 h-4 text-emerald-500" />
                      {assignedAgent.fullname}
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="truncate">Email: {assignedAgent.email}</p>
                      <p>phone : {assignedAgent.phone}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-semibold text-gray-500 italic">
                    No team member assigned yet. Lead is currently in queue.
                  </p>
                )}
              </div>

              {/* Dynamic employeeType Delegate Selector */}
              <div className="space-y-3 pt-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                  Delegate to employeeType
                </label>

                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-white"
                >
                  <option value="">Select employeeType...</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.fullname}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssignAgent}
                  disabled={assigning || !selectedAgentId}
                  className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 active:scale-95 shadow-sm disabled:cursor-not-allowed"
                >
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </div>

            {/* Quick Report Download Sidebar Panel */}
            <div className="bg-gradient-to-tr from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mb-5 -mr-5 pointer-events-none" />

              <div className="space-y-4 relative">
                <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
                <div className="space-y-1">
                  <h4 className="font-black text-base">Generate Receipt Report</h4>
                  <p className="text-xs text-indigo-200 font-medium">
                    Download a full text transcript of this customer lead's profile, financial indicators, contact coordinates, and verification hashes.
                  </p>
                </div>
                <button
                  onClick={handleDownloadReport}
                  className="w-full bg-white text-indigo-950 hover:bg-indigo-50 font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save Plain Text Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}