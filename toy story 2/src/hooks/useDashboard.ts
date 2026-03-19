// hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { DashboardViewModel, StaffDashboardViewModel } from '@/types/DashboardDTO';
import { apiGet } from '@/services/apiClient';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface DashboardCache {
  admin?: CacheItem<DashboardViewModel>;
  staff?: CacheItem<StaffDashboardViewModel>;
}

let cache: DashboardCache = {};

export const useDashboard = () => {
  const [adminData, setAdminData] = useState<DashboardViewModel | null>(null);
  const [staffData, setStaffData] = useState<StaffDashboardViewModel | null>(null);
  const [isLoading, setIsLoading] = useState<{
    admin: boolean;
    staff: boolean;
  }>({ admin: false, staff: false });
  const [error, setError] = useState<{
    admin: string | null;
    staff: string | null;
  }>({ admin: null, staff: null });

  const isCacheValid = <T>(cacheItem?: CacheItem<T>): boolean => {
    if (!cacheItem) return false;
    return Date.now() - cacheItem.timestamp < CACHE_DURATION;
  };

  const getAdminDashboard = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && cache.admin && isCacheValid(cache.admin)) {
      setAdminData(cache.admin.data);
      return cache.admin.data;
    }

    setIsLoading(prev => ({ ...prev, admin: true }));
    setError(prev => ({ ...prev, admin: null }));

    try {
      const response = await apiGet<DashboardViewModel>('/dashboard/admin');
      
      // Update cache
      cache.admin = {
        data: response.data,
        timestamp: Date.now()
      };
      
      setAdminData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch admin dashboard';
      setError(prev => ({ ...prev, admin: errorMessage }));
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, admin: false }));
    }
  }, []);

  const getStaffDashboard = useCallback(async (forceRefresh = false) => {
    // Check cache first
    if (!forceRefresh && cache.staff && isCacheValid(cache.staff)) {
      setStaffData(cache.staff.data);
      return cache.staff.data;
    }

    setIsLoading(prev => ({ ...prev, staff: true }));
    setError(prev => ({ ...prev, staff: null }));

    try {
      const response = await apiGet<StaffDashboardViewModel>('/dashboard/staff');
      
      // Update cache
      cache.staff = {
        data: response.data,
        timestamp: Date.now()
      };
      
      setStaffData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staff dashboard';
      setError(prev => ({ ...prev, staff: errorMessage }));
      throw err;
    } finally {
      setIsLoading(prev => ({ ...prev, staff: false }));
    }
  }, []);

  // Clear cache manually
  const clearCache = useCallback(() => {
    cache = {};
    setAdminData(null);
    setStaffData(null);
  }, []);

  // Auto-refresh function
  const refreshAll = useCallback(async () => {
    await Promise.all([
      getAdminDashboard(true),
      getStaffDashboard(true)
    ]);
  }, [getAdminDashboard, getStaffDashboard]);

  return {
    // Data
    adminData,
    staffData,
    
    // Loading states
    isLoading,
    isAdminLoading: isLoading.admin,
    isStaffLoading: isLoading.staff,
    
    // Errors
    error,
    adminError: error.admin,
    staffError: error.staff,
    
    // Actions
    getAdminDashboard,
    getStaffDashboard,
    refreshAll,
    clearCache,
    
    // Cache status
    isAdminCached: !!cache.admin && isCacheValid(cache.admin),
    isStaffCached: !!cache.staff && isCacheValid(cache.staff)
  };
};

// Optional: More specific hooks for different roles
export const useAdminDashboard = (autoFetch = true) => {
  const { adminData, isAdminLoading, adminError, getAdminDashboard } = useDashboard();

  useEffect(() => {
    if (autoFetch) {
      getAdminDashboard();
    }
  }, [autoFetch, getAdminDashboard]);

  return {
    data: adminData,
    isLoading: isAdminLoading,
    error: adminError,
    refresh: () => getAdminDashboard(true)
  };
};

export const useStaffDashboard = (autoFetch = true) => {
  const { staffData, isStaffLoading, staffError, getStaffDashboard } = useDashboard();

  useEffect(() => {
    if (autoFetch) {
      getStaffDashboard();
    }
  }, [autoFetch, getStaffDashboard]);

  return {
    data: staffData,
    isLoading: isStaffLoading,
    error: staffError,
    refresh: () => getStaffDashboard(true)
  };
};