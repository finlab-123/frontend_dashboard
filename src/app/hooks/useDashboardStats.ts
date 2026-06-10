import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/apiConfig';

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  inProgress: number;
  rejected: number;
  distribution: Array<{
    name: string;
    value: number;
  }>;
}

export interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}


export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_CONFIG.DASHBOARD.GET_STATS);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch stats`);
      }
      
      const body = await res.json();
      setStats(body);
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

