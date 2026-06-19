import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  ShieldCheck,
  DollarSign,
  Clock,
  Download,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { API_CONFIG } from '../config/apiConfig';

interface LeadData {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  pincode?: string;
  pan?: string;
  aadhar?: string;
  employeeType?: string;
  amount?: number;
  requiredAmount?: number;
  loanAmount?: number;
  city?: string;
  state?: string;
  productCategory?: string;
  status?: string;
  assignmentStatus?: string;
  assignedTo?: string[]; 
  createdAt: string;
  updatedAt?: string;
}
export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<LeadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userUrl = API_CONFIG.DASHBOARD.GET_USER_DETAILS(id);
        const res = await fetch(userUrl);
        if (!res.ok) throw new Error(`Failed to fetch user (HTTP ${res.status})`);

        const resData = await res.json();
        if (resData.success && resData.data) {
          setUser(resData.data);
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

    fetchAllData();
  }, [id]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadReport = () => {
    if (!user) return;

    const reportContent = `
Report Generated: ${new Date().toLocaleString('en-IN')}
Lead ID: ${user._id}
Created At: ${user.createdAt ? new Date(user.createdAt).toLocaleString('en-IN') : 'N/A'}
Status: ${user.status || 'Pending'}
Name: ${user.firstName || ''} ${user.lastName || ''}
DOB: ${user.dob || 'N/A'}
Gender: ${user.gender || 'N/A'}
Employment: ${user.employeeType || 'N/A'}

Contact Details:
Email: ${user.email || 'N/A'}
Phone: ${user.phone || 'N/A'}
Location: ${user.city || 'N/A'}, ${user.state || 'N/A'} - ${user.pincode || 'N/A'}

Product Details:
Category: ${user.productCategory || 'N/A'}
Requested Amount: ${user.amount || user.requiredAmount ? `INR ${Number(user.amount || user.requiredAmount).toLocaleString('en-IN')}` : 'N/A'}
PAN: ${user.pan ? user.pan.toUpperCase() : 'N/A'}
Aadhaar: ${user.aadhar ? '[Aadhaar Redacted]' : 'N/A'}
Assignment Status: ${user.assignmentStatus || 'Unassigned'}
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Report_${user.firstName || 'Lead'}_${user._id.substring(0, 8)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Report downloaded successfully');
  };

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
  const initial = user.firstName?.[0] || 'U';
  const targetLoanAmount = user.amount || user.requiredAmount || user.loanAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-gray-900 border border-gray-800 text-white px-5 py-4 rounded-xl shadow-2xl">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
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

        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-50/40 via-blue-50/10 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="flex items-center gap-5 sm:gap-6 relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-md border-2 border-indigo-100 flex-shrink-0">
              {initial.toUpperCase()}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{fullName}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {user.status || 'Pending'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm font-medium text-gray-500">
                <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md font-semibold text-xs tracking-wider uppercase">
                  {user.productCategory || 'Uncategorized'}
                </span>
                <span className="text-gray-400">
                  Assignment: <strong className="text-gray-700 font-semibold">{user.assignmentStatus || 'Pending'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Applied:{' '}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })
                    : 'N/A'}
                </span>
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Requested Amount</span>
                  <div className="text-2xl font-black text-gray-900">
                    {targetLoanAmount
                      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(targetLoanAmount)
                      : 'N/A'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Employment Status</span>
                  <div className="text-2xl font-black text-gray-900">
                    {user.employeeType || 'N/A'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</span>
                    <p className="text-sm font-semibold text-gray-900">{fullName}</p>
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
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Contact Information</h3>
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
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${user.phone}`} className="hover:underline">
                        {user.phone || 'N/A'}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Official Identity Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">PAN Number</span>
                    <p className="text-sm font-black text-gray-900 tracking-wider flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      {user.pan ? user.pan.toUpperCase() : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Aadhaar Number</span>
                    <p className="text-sm font-semibold text-gray-900 tracking-wider flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      {user.aadhar ? '[Aadhaar Redacted]' : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Residential Address</h3>
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
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Timeline Indicators</h3>
              <div className="space-y-4">
                <div className="space-y-1.5 border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Created At</span>
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                      : 'N/A'}
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

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" /> Application Status
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Current Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {user.status || 'Pending'}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full -mb-5 -mr-5 pointer-events-none" />
              <div className="space-y-4 relative">
                <FileSpreadsheet className="w-8 h-8 text-indigo-400" />
                <div className="space-y-1">
                  <h4 className="font-black text-base">Generate Receipt Report</h4>
                  <p className="text-xs text-indigo-200 font-medium">
                    Download a full text transcript of this customer lead's profile, financial indicators, and contact coordinates.
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