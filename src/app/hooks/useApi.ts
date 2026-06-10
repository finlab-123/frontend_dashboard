import { useState, useCallback } from 'react';
import { API_CONFIG, apiCall } from '../config/apiConfig';


export const useFetch = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(url);
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url]);

  return { data, loading, error, fetchData };
};


export const useCRUD = (baseUrl: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createItem = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(baseUrl, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errorMsg = result.error || 'Unknown error';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const updateItem = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const url = `${baseUrl}/${id}`;
      const result = await apiCall(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errorMsg = result.error || 'Unknown error';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const url = `${baseUrl}/${id}`;
      const result = await apiCall(url, {
        method: 'DELETE',
      });
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errorMsg = result.error || 'Unknown error';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting item';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  return { loading, error, createItem, updateItem, deleteItem };
};


export const useDashboard = () => {
  const { data: stats, loading: statsLoading, error: statsError, fetchData: fetchStats } = useFetch(API_CONFIG.DASHBOARD.GET_STATS);
  const { data: leads, loading: leadsLoading, error: leadsError, fetchData: fetchLeads } = useFetch(API_CONFIG.DASHBOARD.GET_ALL_LEADS);

  return {
    stats,
    statsLoading,
    statsError,
    fetchStats,
    leads,
    leadsLoading,
    leadsError,
    fetchLeads,
  };
};

export const useLeads = (category?: string) => {
  const url = category ? API_CONFIG.DASHBOARD.GET_LEADS_BY_CATEGORY(category) : API_CONFIG.DASHBOARD.GET_ALL_LEADS;
  const { data, loading: dataLoading, error: dataError, fetchData } = useFetch(url);
  const { loading: crudLoading, error: crudError, createItem, updateItem, deleteItem } = useCRUD(API_CONFIG.LEADS.GET_ALL);

  return {
    leads: data?.data || [],
    loading: dataLoading || crudLoading,
    error: dataError || crudError,
    fetchLeads: fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
};

export const useProducts = (productType: string) => {
  const baseUrl = API_CONFIG.PRODUCTS[productType as keyof typeof API_CONFIG.PRODUCTS]?.GET_ALL || '';
  const { data, loading: dataLoading, error: dataError, fetchData } = useFetch(baseUrl);
  const { loading: crudLoading, error: crudError, createItem, updateItem, deleteItem } = useCRUD(baseUrl);

  return {
    products: data?.data || [],
    loading: dataLoading || crudLoading,
    error: dataError || crudError,
    fetchProducts: fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
};

export const useLoans = (loanType: string) => {
  const baseUrl = API_CONFIG.LOANS[loanType as keyof typeof API_CONFIG.LOANS]?.GET_ALL || '';
  const { data, loading: dataLoading, error: dataError, fetchData } = useFetch(baseUrl);
  const { loading: crudLoading, error: crudError, createItem, updateItem, deleteItem } = useCRUD(baseUrl);

  return {
    loans: data?.data || [],
    loading: dataLoading || crudLoading,
    error: dataError || crudError,
    fetchLoans: fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
};

