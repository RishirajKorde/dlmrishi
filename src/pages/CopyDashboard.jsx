import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Clock, AlertCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Book as BookIcon } from 'lucide-react';
import api from '../api/axios.js'
import TableSkeleton from '../components/TableSkeleton';
import { toast } from 'react-toastify';

const StatCard = ({ title, value, icon: Icon, color, trend, loading }) => {
    const isPositive = trend >= 0;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <Icon size={24} />
                </div>
                {!loading && trend !== undefined && (
                    <div className={`flex items-center gap-1 font-medium text-sm ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            {loading ? (
                <div className="h-8 w-24 bg-slate-100 animate-pulse rounded"></div>
            ) : (
                <p className="text-2xl font-bold text-slate-900">{value?.toLocaleString() || 0}</p>
            )}
        </div>
    );
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/v1/dashboard');
            if (response.data?.status === 200) {
                setData(response.data.data);
            } else {
                toast.error(response.data?.message || "Failed to fetch dashboard data");
            }
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
            toast.error("An error occurred while fetching dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const stats = data?.stats || {};
    const trends = stats.trends || {};
    const transactions = data?.recentTransactions || [];
    const branchPerformance = data?.branchPerformance || [];

    return (
        <div className="space-y-8">
            {/* Header with Refresh */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Library Dashboard</h1>
                    {/* <p className="text-slate-500 text-sm">Welcome back, here's what's happening today.</p> */}
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                    title="Refresh Data"
                    disabled={loading}
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Members"
                    value={stats.totalMembers}
                    icon={Users}
                    color="bg-blue-200"
                    trend={trends.members}
                    loading={loading}
                />
                <StatCard
                    title="Total Books"
                    value={stats.totalBooks}
                    icon={BookOpen}
                    color="bg-emerald-200"
                    trend={trends.books}
                    loading={loading}
                />
                <StatCard
                    title="Issued Today"
                    value={stats.issuedToday}
                    icon={Clock}
                    color="bg-amber-200"
                    trend={trends.issued}
                    loading={loading}
                />
                <StatCard
                    title="Overdue Items"
                    value={stats.overdueItems}
                    icon={AlertCircle}
                    color="bg-rose-200"
                    trend={trends.overdue}
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                        <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Member</th>
                                    <th className="px-6 py-4">Book Title</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <TableSkeleton rows={5} columns={4} />
                                ) : transactions.length > 0 ? (
                                    transactions.map((txn, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100">
                                                        {txn.user?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-800 text-sm">{txn.user}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <BookIcon size={14} className="text-slate-400" />
                                                    <span className="text-slate-600 text-sm truncate max-w-[200px]">{txn.book}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-medium">{txn.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${txn.type === 'ISSUE'
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                    {txn.type}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm italic">
                                            No recent transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Branch Performance */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6">Branch Performance</h3>
                    <div className="space-y-6">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between h-4 w-full bg-slate-100 animate-pulse rounded"></div>
                                    <div className="h-2 w-full bg-slate-100 animate-pulse rounded-full"></div>
                                </div>
                            ))
                        ) : branchPerformance.length > 0 ? (
                            branchPerformance.map((branch, idx) => {
                                // Calculate percentage relative to max count for visualization if needed, 
                                // or just use count as a percentage if it represents one.
                                // For now, let's treat count as a literal value and maybe scale it.
                                const maxCount = Math.max(...branchPerformance.map(b => b.count), 1);
                                const percentage = (branch.count / maxCount) * 100;
                                const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-indigo-600', 'bg-rose-600'];

                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="font-semibold text-slate-700 truncate pr-2">{branch.name}</span>
                                            <span className="text-slate-500 font-bold">{branch.count}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colors[idx % colors.length]} transition-all duration-1000 ease-out`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-slate-400 text-sm italic">
                                No branch data available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

