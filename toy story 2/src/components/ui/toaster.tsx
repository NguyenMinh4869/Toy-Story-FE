"use client";

import { useToast } from "@/hooks/useToast";
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastViewport,
} from "./toast";

export function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <ToastProvider>
            {toasts.map(({ id, title, description, variant, duration }) => (
                <Toast
                    key={id}
                    variant={variant}
                    duration={duration}
                    onOpenChange={(open) => {
                        if (!open) dismiss(id);
                    }}
                >
                    <div className="flex flex-col gap-1 flex-1">
                        {title && <div className="font-semibold">{title}</div>}
                        {description && <ToastDescription>{description}</ToastDescription>}
                    </div>
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport />
        </ToastProvider>
    );
}