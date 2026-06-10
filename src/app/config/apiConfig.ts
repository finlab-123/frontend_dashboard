const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  DASHBOARD: {
    GET_ALL_LEADS: `${API_BASE_URL}/api/dashboard/allleads`,
    GET_STATS: `${API_BASE_URL}/api/dashboard/stats`,
    SEED_LEADS: `${API_BASE_URL}/api/dashboard/seed`,
    // Fixed: added missing slash before 'dashboard'
    GET_LEADS_BY_STATUS: (status: string) => `${API_BASE_URL}/api/dashboard/filter/status/${status}`,
    GET_LEADS_BY_CATEGORY: (category: string) => `${API_BASE_URL}/api/dashboard/filter/category/${category}`,
    GET_LEADS_BY_DATE_RANGE: `${API_BASE_URL}/api/dashboard/filter/date-range`,
    ASSIGN_LEAD: `${API_BASE_URL}/api/dashboard/assign`,
    UNASSIGN_LEAD: `${API_BASE_URL}/api/dashboard/unassign`,
    GET_ASSIGNED_TEAMS: (projectId: string) => `${API_BASE_URL}/api/dashboard/assigned/${projectId}`,
    GET_USER_DETAILS: (id: string) => `${API_BASE_URL}/api/dashboard/user/${id}`,
  },

  TEAM_ASSIGN: {
    GET_ALL: `${API_BASE_URL}/api/team-assign`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/team-assign/${id}`,
    CREATE: `${API_BASE_URL}/api/team-assign`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/team-assign/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/team-assign/${id}`,
  },

  LEADS: {
    GET_ALL: `${API_BASE_URL}/api/leads/leads`,
    GET_BY_ID: (id: string) => `${API_BASE_URL}/api/leads/leads/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/api/leads/leads/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/api/leads/leads/${id}`,
    FETCH_BY_CATEGORY: (category: string) => `${API_BASE_URL}/api/leads/${category}`,
  },

  LOANS: {
    HOME_LOAN: { GET_ALL: `${API_BASE_URL}/api/loans/home-loan`, GET_BY_ID: (id: string) => `${API_BASE_URL}/api/loans/home-loan/${id}` },
    VEHICLE_LOAN: { GET_ALL: `${API_BASE_URL}/api/loans/vehicle-loan`, GET_BY_ID: (id: string) => `${API_BASE_URL}/api/loans/vehicle-loan/${id}` },
  }
};

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiCall = async (url: string, options: FetchOptions = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('API Call Failure:', error);
    return { success: false, error: error.message || 'Server unreachable' };
  }
};

export default API_CONFIG;