// components/providers/ToastProvider.tsx
"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { setGlobalToast } from "@/services/apiClient";
import { Toaster } from "@/components/ui/toaster";

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const { toast } = useToast();


    useEffect(() => {
        setGlobalToast(toast);
    }, [toast]);

    return (
        <>
            {children}
            <Toaster />
        </>
    );
}