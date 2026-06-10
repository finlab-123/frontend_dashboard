import React, { useEffect, useState } from 'react';
import { BarChart3, Download, Calendar, Users, ShieldAlert } from 'lucide-react';
import { LeadGenerationChart } from '../components/LeadGenerationChart';
import { LoanDistributionChart } from '../components/LoanDistributionChart';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useMonthlyLeads } from '../hooks/useMonthlyLeads';
import { apiCall, API_CONFIG } from '../config/apiConfig.ts';

interface TeamMemberPerformance {
  _id: string;
  name: string;
  role: string;
  assignedLeadsCount: number;
  rate: string;
}

export function ReportsPage() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { data: monthlyData, loading: monthlyLoading, error: monthlyError } = useMonthlyLeads();
  
  
  const [teamPerformance, setTeamPerformance] = useState<TeamMemberPerformance[]>([]);
  const [teamLoading, setTeamLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTeamMetrics() {
      setTeamLoading(true);
      
      const result = await apiCall(API_CONFIG.TEAM_ASSIGN.GET_ALL);
      if (result.success) {
        const payload = result.data?.teams || result.data?.data || result.data || [];
        setTeamPerformance(Array.isArray(payload) ? payload : []);
      }
      setTeamLoading(false);
    }
    fetchTeamMetrics();
  }, []);

  
  const conversionRate = stats?.total
    ? (((stats.approved || 0) / stats.total) * 100).toFixed(1)
    : '0.0';

  
  const pendingPercentage = stats?.total
    ? (((stats.pending || 0) / stats.total) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 mb-1 font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Comprehensive historical insights and data analysis pipeline</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4 text-gray-400" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {}
      {(statsError || monthlyError) && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>Failed loading analytics charts pipeline metadata. Please check backend availability.</span>
        </div>
      )}

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Lead Generation Timeline</h2>
          <LeadGenerationChart
            data={monthlyData || []}
            loading={monthlyLoading}
            error={monthlyError}
          />
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Loan Categories Spread</h2>
          <LoanDistributionChart chartData={stats?.distribution || []} />
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-900">Performance Metrics Summary</h2>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-1">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : (stats?.total ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-medium">All database records</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-1">Conversion Efficiency</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : `${conversionRate}%`}
            </p>
            <p className="text-xs text-emerald-600 font-medium">Approved leads ratio</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-1">In Processing Pool</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : (stats?.inProgress ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-blue-600 font-medium">Active CRM assignments</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-1">Pending Verification</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {statsLoading ? '...' : `${pendingPercentage}%`}
            </p>
            <p className="text-xs text-amber-600 font-medium">Awaiting manual audit</p>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Pipeline Status Proportions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { label: 'Approved', value: stats?.approved ?? 0, color: 'bg-emerald-500', max: stats?.total || 1 },
            { label: 'Pending Audit', value: stats?.pending ?? 0, color: 'bg-amber-500', max: stats?.total || 1 },
            { label: 'In Progress Operations', value: stats?.inProgress ?? 0, color: 'bg-blue-500', max: stats?.total || 1 },
            { label: 'Rejected / Archived', value: stats?.rejected ?? 0, color: 'bg-rose-500', max: stats?.total || 1 },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium text-gray-700">{item.label}</p>
                <span className="font-semibold text-gray-900">{statsLoading ? '...' : item.value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${((item.value || 0) / (item.max || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Active Agent & Team Performance</h2>
        </div>
        
        {teamLoading ? (
          <div className="text-center py-8 text-sm text-gray-400">Syncing workforce performance metrics...</div>
        ) : teamPerformance.length === 0 ? (
          <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
            <p className="text-sm">No operational team assignments logged yet.</p>
            <p className="text-xs text-gray-400 mt-1">Assign incoming leads to populate active performance rates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamPerformance.map((member) => (
              <div key={member._id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-xs text-gray-500">{member.role || 'Sales Representative'}</p>
                  <p className="text-xs text-gray-400 mt-2">Leads Count: <span className="font-medium text-gray-700">{member.assignedLeadsCount || 0}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Conversion</p>
                  <p className="text-base font-bold text-blue-600">{member.rate || '0.0%'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
