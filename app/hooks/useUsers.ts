'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  status: string;
  created_at: string;
}

// Query key factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

// API functions
const fetchUsers = async (): Promise<{ users: User[]; total: number; timestamp: string }> => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch users');
  }
  return data;
};

const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to create user');
  }
  
  return data.user;
};

const updateUser = async ({ id, userData }: { id: number; userData: Partial<User> }): Promise<User> => {
  const response = await fetch(`/api/users?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to update user');
  }
  
  return data.user;
};

const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`/api/users?id=${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete user');
  }
};

// Custom hooks
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createUser,
    onMutate: async (newUser) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(userKeys.lists());

      // Optimistically update to the new value
      queryClient.setQueryData(userKeys.lists(), (old: any) => {
        if (!old) return old;
        
        const optimisticUser: User = {
          id: Date.now(), // Temporary ID
          ...newUser,
        };
        
        return {
          ...old,
          users: [...old.users, optimisticUser],
          total: old.total + 1,
        };
      });

      // Return a context object with the snapshotted value
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateUser,
    onMutate: async ({ id, userData }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      
      const previousUsers = queryClient.getQueryData(userKeys.lists());
      
      // Optimistically update the user
      queryClient.setQueryData(userKeys.lists(), (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          users: old.users.map((user: User) =>
            user.id === id ? { ...user, ...userData } : user
          ),
        };
      });
      
      return { previousUsers };
    },
    onError: (err, { id, userData }, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteUser,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      
      const previousUsers = queryClient.getQueryData(userKeys.lists());
      
      // Optimistically remove the user
      queryClient.setQueryData(userKeys.lists(), (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          users: old.users.filter((user: User) => user.id !== id),
          total: old.total - 1,
        };
      });
      
      return { previousUsers };
    },
    onError: (err, id, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
