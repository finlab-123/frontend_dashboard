import React, { useEffect, useState } from 'react';
import { Link } from 'react-router'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_CONFIG } from '../config/apiConfig'; 
import { ArrowUpRight, BarChart2 } from 'lucide-react';

interface MonthlyLeadData {
  month: string;
  leads: number;
}

export function LeadGenerationChart() {
  const [data, setData] = useState<MonthlyLeadData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    async function fetchChartMetrics() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_CONFIG.DASHBOARD.GET_STATS, {
          signal: abortController.signal,
          headers: {
            'Accept': 'application/json',
            
            
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status} (${response.statusText})`);
        }

        const jsonResult = await response.json();

        if (isMounted) {
          
          const rawTrends = jsonResult.monthlyTrends || jsonResult.data?.monthlyTrends || jsonResult.trends;
          
          if (Array.isArray(rawTrends)) {
            setData(rawTrends);
          } else if (Array.isArray(jsonResult)) {
            setData(jsonResult); 
          } else {
            console.error('Unexpected Production API Payload Structure:', jsonResult);
            setData([]);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          
          return;
        }

        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to synchronize system analytics';
          console.error('[Production Analytics Engine Failure]:', err);
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchChartMetrics();

    return () => {
      isMounted = false;
      abortController.abort(); 
    };
  }, []);

  
  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-[340px] flex flex-col justify-center items-center text-center">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <span className="text-red-600 text-sm font-bold">!</span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900">Failed to load analytics</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">{error}</p>
      </div>
    );
  }

  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-[340px] flex flex-col justify-between animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
        </div>
        <div className="h-44 bg-gray-50/50 rounded-lg border border-dashed border-gray-100 w-full flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-[340px] flex flex-col justify-center items-center text-center">
        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-400">
          <BarChart2 className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-gray-900">No data available</h4>
        <p className="text-xs text-gray-500 mt-1 max-w-xs">
          There is currently no trend data recorded for this time frame.
        </p>
      </div>
    );
  }

  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative group">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-gray-900 mb-1 font-bold text-base tracking-tight">Lead Generation Trend</h3>
          <p className="text-xs text-gray-500">Monthly inbound operational lead volume</p>
        </div>

        <Link 
          to="/leads" 
          className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors border border-blue-100/50"
        >
          View Leads
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                padding: '8px 12px'
              }}
              labelStyle={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}
              itemStyle={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2, r: 4 }}
              activeDot={{ fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
