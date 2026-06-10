import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { dashboardService } from '../services/dashboardService';

export interface ProductStats {
  total: number;
  approved: number;
  pending: number;
  avgAmount: number;
}

interface ProductStatsDisplayProps {
  category: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    key: keyof ProductStats;
    icon: LucideIcon;
    format?: (value: number) => string;
  }>;
}


export function ProductStatsDisplay({
  category,
  title,
  description,
  stats: statsConfig,
}: ProductStatsDisplayProps) {
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    approved: 0,
    pending: 0,
    avgAmount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardService.getLeadsByCategory(category);
        const leads = response.data || [];


        const approved = leads.filter((l: any) => l.status === 'Approved').length;
        const pending = leads.filter((l: any) => l.status === 'Pending').length;
        const avgAmount = leads.length > 0
          ? leads.reduce((sum: number, lead: any) => sum + (lead.loanAmount || 0), 0) / leads.length
          : 0;

        setStats({
          total: leads.length,
          approved,
          pending,
          avgAmount,
        });
      } catch (err: any) {
        console.error(`Error fetching ${category} stats:`, err);
        setError(err.message || `Failed to load ${category} statistics`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryStats();
  }, [category]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <h3 className="font-semibold mb-2">Error Loading {title}</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1 font-bold">{title}</h1>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {statsConfig.map((config) => (
          <StatsCard
            key={config.key}
            title={config.label}
            value={loading ? '...' : config.format
              ? config.format(stats[config.key])
              : stats[config.key].toLocaleString()}
            change={loading ? 'Loading...' : '+8.4% from last month'}
            isPositive={true}
            icon={config.icon}
          />
        ))}
      </div>
    </div>
  );
}

