import { useState, useEffect } from 'react';

export interface MonthlyLeadData {
  month: string;
  leads: number;
}

export interface UseMonthlyLeadsReturn {
  data: MonthlyLeadData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}


export function useMonthlyLeads(): UseMonthlyLeadsReturn {
  const [data, setData] = useState<MonthlyLeadData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      
      const months: MonthlyLeadData[] = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        
        const leads = Math.floor(Math.random() * 200) + 100;
        
        months.push({
          month: monthName,
          leads,
        });
      }

      setData(months);
    } catch (err: any) {
      console.error('Error generating monthly lead data:', err);
      setError(err.message || 'Failed to load monthly lead data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyLeads();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchMonthlyLeads,
  };
}

