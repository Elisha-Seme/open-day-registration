"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { Users, Baby, Activity, ArrowLeft, Loader2, RefreshCcw, Lock, KeyRound, Utensils } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [passError, setPassError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/analytics");
            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") {
            setIsAuthenticated(true);
            setPassError(false);
        } else {
            setPassError(true);
            setPassword("");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-200"
                >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <Lock className="text-primary w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-center mb-2 text-slate-900 tracking-tight uppercase">Dashboard Lock</h2>
                    <p className="text-slate-500 text-center mb-8 text-sm">Enter password to view registration data.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className={cn(
                                    "w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium",
                                    passError ? "border-red-500 ring-red-500" : "border-slate-300"
                                )}
                            />
                        </div>
                        {passError && <p className="text-xs text-red-500 font-bold ml-1">Incorrect password.</p>}
                        <button
                            type="submit"
                            className="w-full py-3 bg-primary text-white rounded-lg font-black tracking-wide hover:bg-primary/95 transition-all shadow-lg"
                        >
                            ACCESS DATA
                        </button>
                    </form>
                    <div className="mt-8 text-center text-xs font-bold text-slate-400">
                        <Link href="/" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> RETURN TO SITE
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">Loading Local Data...</p>
            </div>
        );
    }

    const foodData = Object.entries(data?.foodPrefs || {}).map(([name, value]) => ({ name, value }));
    const ageData = Object.entries(data?.ageRanges || {}).map(([name, value]) => ({ name, value }));
    const allergyData = Object.entries(data?.allergies || {}).map(([name, value]) => ({ name, value }));

    return (
        <main className="max-w-6xl mx-auto py-16 px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
                <div>
                    <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 hover:text-primary transition-colors mb-4 uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Registration
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Admin <span className="text-primary">Dashboard</span></h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase tracking-tighter text-xs">Manga House Open Day Registration Data</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all text-sm shadow-sm"
                >
                    <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                    SYNC DATA
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <StatsCard icon={<Users />} title="Registrations" value={data?.totalSubmissions || 0} bgClass="bg-blue-600" />
                <StatsCard icon={<Baby />} title="Children Total" value={data?.totalChildren || 0} bgClass="bg-indigo-600" />
                <StatsCard icon={<Utensils />} title="Food Opt-ins" value={Object.values(data?.foodPrefs || {}).reduce((a: number, b: any) => a + b, 0) as number} bgClass="bg-orange-500" />
                <StatsCard icon={<Activity />} title="Allergy Alerts" value={Object.values(data?.allergies || {}).reduce((a: number, b: any) => a + b, 0) as number} bgClass="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 lg:col-span-1">
                    <h3 className="text-xs font-black mb-8 text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Catering Preferences</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={foodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {foodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 lg:col-span-2">
                    <h3 className="text-xs font-black mb-8 text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Allergy Breakdown (Total Impact)</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={allergyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <h3 className="text-xs font-black mb-10 text-slate-400 uppercase tracking-[0.2em] border-b pb-4">Real-time Submission Log</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-tighter">Attendee</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-tighter">Preference</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-tighter">Status</th>
                                <th className="pb-4 font-black text-slate-400 uppercase tracking-tighter text-right">Registered At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.recentSubmissions?.map((s: any) => (
                                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-5">
                                        <p className="font-bold text-slate-900">{s.fullName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{s.email}</p>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex gap-1 flex-wrap">
                                            {s.foodPreference?.map((p: string) => (
                                                <span key={p} className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-black uppercase tracking-tighter border border-orange-200">
                                                    {p}
                                                </span>
                                            ))}
                                            {s.childAgeRanges?.length > 0 && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black uppercase tracking-tighter border border-blue-200">
                                                    {s.childAgeRanges.join(", ")} Ages
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-[10px] font-black text-slate-700 uppercase">{s.childCount} ATTENDING</span>
                                        </div>
                                    </td>
                                    <td className="py-5 text-right font-black text-slate-400 text-[10px] uppercase tracking-tighter">
                                        {new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

function StatsCard({ icon, title, value, bgClass }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-inner", bgClass)}>
                {icon && React.cloneElement(icon as any, { size: 18, strokeWidth: 3 })}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] leading-none mb-1.5">{title}</p>
                <p className="text-2xl font-black tracking-tighter text-slate-900">{value}</p>
            </div>
        </div>
    );
}
