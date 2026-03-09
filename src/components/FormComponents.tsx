"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
    return (
        <div className={cn("p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm mb-6", className)}>
            <h3 className="text-xl font-bold mb-1 text-slate-900">{title}</h3>
            {description && <p className="text-sm text-slate-500 mb-6">{description}</p>}
            <div className="space-y-4">{children}</div>
        </div>
    );
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function InputField({ label, error, className, ...props }: InputFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 px-0.5">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <input
                className={cn(
                    "flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    error && "border-red-500 focus-visible:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1 px-0.5">{error}</p>}
        </div>
    );
}
