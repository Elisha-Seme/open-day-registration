"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AllergyEntry {
    allergy: string;
    ageBracket: string;
    childCount: string;
}

interface AllergyGridProps {
    allergies: string[];
    ageRanges: string[];
    value: AllergyEntry[];
    onChange: (value: AllergyEntry[]) => void;
}

export function AllergyGrid({ allergies, ageRanges, value, onChange }: AllergyGridProps) {
    const updateEntry = (allergy: string, field: "ageBracket" | "childCount", newVal: string) => {
        const existingIndex = value.findIndex(v => v.allergy === allergy);
        const newValue = [...value];

        if (existingIndex > -1) {
            newValue[existingIndex] = { ...newValue[existingIndex], [field]: newVal };
        } else {
            newValue.push({
                allergy,
                ageBracket: field === "ageBracket" ? newVal : "",
                childCount: field === "childCount" ? newVal : "1"
            });
        }

        // Filter out rows where both selections are empty if needed, 
        // but here we probably want to keep them if they've interacted
        onChange(newValue);
    };

    const getEntry = (allergy: string) => {
        return value.find(v => v.allergy === allergy) || { ageBracket: "", childCount: "" };
    };

    return (
        <div className="overflow-x-auto border rounded-xl border-slate-200 shadow-sm">
            <table className="w-full text-sm border-collapse bg-white">
                <thead>
                    <tr>
                        <th className="p-4 text-left bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[10px]">Allergy Type</th>
                        <th className="p-4 text-left bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[10px]">Age Bracket</th>
                        <th className="p-4 text-left bg-slate-50 font-bold text-slate-700 border-b border-slate-200 uppercase tracking-wider text-[10px]">No. of Children</th>
                    </tr>
                </thead>
                <tbody>
                    {allergies.map((allergy) => {
                        const entry = getEntry(allergy);
                        return (
                            <tr key={allergy} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-bold text-slate-900">{allergy}</td>
                                <td className="p-4">
                                    <select
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        value={entry.ageBracket}
                                        onChange={(e) => updateEntry(allergy, "ageBracket", e.target.value)}
                                    >
                                        <option value="">Select Age</option>
                                        {ageRanges.map(range => (
                                            <option key={range} value={range}>{range}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <select
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                                        value={entry.childCount}
                                        onChange={(e) => updateEntry(allergy, "childCount", e.target.value)}
                                    >
                                        <option value="">Select Count</option>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>{n}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
