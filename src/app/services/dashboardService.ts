import { API_CONFIG } from '../config/apiConfig';

export interface DashboardStatsResponse {
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

export interface AllLeadsResponse {
  message: string;
  total: number;
  data: any[];
}


export const dashboardService = {
  
  getStats: async (): Promise<DashboardStatsResponse> => {
    const response = await fetch(API_CONFIG.DASHBOARD.GET_STATS);
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: HTTP ${response.status}`);
    }
    return response.json();
  },

  
  getAllLeads: async (): Promise<AllLeadsResponse> => {
    const response = await fetch(API_CONFIG.DASHBOARD.GET_ALL_LEADS);
    if (!response.ok) {
      throw new Error(`Failed to fetch all leads: HTTP ${response.status}`);
    }
    return response.json();
  },

  
  getLeadsByStatus: async (status: string) => {
    const response = await fetch(API_CONFIG.DASHBOARD.GET_LEADS_BY_STATUS(status));
    if (!response.ok) {
      throw new Error(`Failed to fetch leads by status: HTTP ${response.status}`);
    }
    return response.json();
  },

  
  getLeadsByCategory: async (category: string) => {
    const response = await fetch(API_CONFIG.DASHBOARD.GET_LEADS_BY_CATEGORY(category));
    if (!response.ok) {
      throw new Error(`Failed to fetch leads by category: HTTP ${response.status}`);
    }
    return response.json();
  },

  
  getLeadsByDateRange: async (startDate: Date, endDate: Date) => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    const response = await fetch(`${API_CONFIG.DASHBOARD.GET_LEADS_BY_DATE_RANGE}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch leads by date range: HTTP ${response.status}`);
    }
    return response.json();
  },

  
  assignLead: async (leadId: string, assignedTo: string) => {
    const response = await fetch(API_CONFIG.DASHBOARD.ASSIGN_LEAD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, assignedTo }),
    });
    if (!response.ok) {
      throw new Error(`Failed to assign lead: HTTP ${response.status}`);
    }
    return response.json();
  },

  
  unassignLead: async (leadId: string) => {
    const response = await fetch(API_CONFIG.DASHBOARD.UNASSIGN_LEAD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    });
    if (!response.ok) {
      throw new Error(`Failed to unassign lead: HTTP ${response.status}`);
    }
    return response.json();
  },

  
  getAssignedTeams: async (projectId: string) => {
    const response = await fetch(API_CONFIG.DASHBOARD.GET_ASSIGNED_TEAMS(projectId));
    if (!response.ok) {
      throw new Error(`Failed to fetch assigned teams: HTTP ${response.status}`);
    }
    return response.json();
  },
};

