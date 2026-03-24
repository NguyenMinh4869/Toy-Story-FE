import React, { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}


let listeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const addToast = (toast: Omit<Toast, "id">) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { ...toast, id };
  toasts = [...toasts, newToast];
  listeners.forEach(listener => listener(toasts));

  // Auto dismiss
  setTimeout(() => {
    dismissToast(id);
  }, toast.duration || 5000);
};

const dismissToast = (id: string) => {
  toasts = toasts.filter(t => t.id !== id);
  listeners.forEach(listener => listener(toasts));
};

export const useToast = () => {
  const [state, setState] = useState<Toast[]>(toasts);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, [subscribe]);

  return {
    toasts: state,
    toast: addToast,
    dismiss: dismissToast,
  };
};