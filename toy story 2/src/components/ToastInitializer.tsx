// components/ToastInitializer.tsx
import { useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { setGlobalToast } from '../services/apiClient';

export const ToastInitializer = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    setGlobalToast(toast);
  }, [toast]);
  
  return null;
};