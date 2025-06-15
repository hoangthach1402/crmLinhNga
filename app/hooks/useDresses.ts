import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dress } from '../../lib/googleSheets';

export interface DressFilters {
  search?: string;
  month?: string;
  designer?: string;
  time_dap?: number;
  time_dinh?: number;
}

// Fetch dresses with pagination and search
const fetchDresses = async (
  page: number = 1, 
  limit: number = 50, 
  filters: DressFilters = {}
): Promise<{
  dresses: Dress[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // Add filters to params
  if (filters.search) params.append('search', filters.search);
  if (filters.month) params.append('month', filters.month);
  if (filters.designer) params.append('designer', filters.designer);
  if (filters.time_dap !== undefined) params.append('time_dap', filters.time_dap.toString());
  if (filters.time_dinh !== undefined) params.append('time_dinh', filters.time_dinh.toString());
  
  const response = await fetch(`/api/dresses?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch dresses');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch dresses');
  }
  
  return data;
};

const createDress = async (dressData: Omit<Dress, 'id'>): Promise<Dress> => {
  const response = await fetch('/api/dresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dressData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create dress');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to create dress');
  }
  
  return data.dress;
};

const updateDress = async ({ id, dressData }: { id: number; dressData: Partial<Dress> }): Promise<Dress> => {
  const response = await fetch(`/api/dresses?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dressData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update dress');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to update dress');
  }
  
  return data.dress;
};

const deleteDress = async (id: number): Promise<void> => {
  const response = await fetch(`/api/dresses?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete dress');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete dress');
  }
};

export const useDresses = (page: number = 1, limit: number = 50, filters: DressFilters = {}) => {
  return useQuery({
    queryKey: ['dresses', page, limit, filters],
    queryFn: () => fetchDresses(page, limit, filters),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};

export const useCreateDress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDress,
    onSuccess: () => {
      // Invalidate all dress queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['dresses'] });
    },
  });
};

export const useUpdateDress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateDress,
    onSuccess: () => {
      // Invalidate all dress queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['dresses'] });
    },
  });
};

export const useDeleteDress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteDress,
    onSuccess: () => {
      // Invalidate all dress queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['dresses'] });
    },
  });
};
