import React from 'react';
import { Users, BookOpen, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
        <ArrowUpRight size={16} />
        {trend}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value="12,482" 
          icon={Users} 
          color="bg-blue-500" 
          trend="+12%" 
        />
        <StatCard 
          title="Total Books" 
          value="45,210" 
          icon={BookOpen} 
          color="bg-emerald-500" 
          trend="+4%" 
        />
        <StatCard 
          title="Issued Today" 
          value="342" 
          icon={Clock} 
          color="bg-amber-500" 
          trend="+8%" 
        />
        <StatCard 
          title="Overdue Items" 
          value="56" 
          icon={AlertCircle} 
          color="bg-rose-500" 
          trend="-2%" 
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
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { user: "Rahul Sharma", book: "Atomic Habits", date: "10:30 AM", status: "Returned", color: "text-emerald-600 bg-emerald-50" },
                  { user: "Priya V.", book: "The Alchemist", date: "09:45 AM", status: "Issued", color: "text-blue-600 bg-blue-50" },
                  { user: "Amit Patel", book: "Deep Work", date: "Yesterday", status: "Overdue", color: "text-rose-600 bg-rose-50" },
                  { user: "Sneha G.", book: "Clean Code", date: "Yesterday", status: "Issued", color: "text-blue-600 bg-blue-50" },
                ].map((txn, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                        {txn.user.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-800">{txn.user}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{txn.book}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{txn.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${txn.color}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Branch Performance</h3>
          <div className="space-y-6">
            {[
              { name: "Central Library", count: "85%", color: "bg-blue-600" },
              { name: "Dharampeth Branch", count: "62%", color: "bg-emerald-600" },
              { name: "Sitabuldi Branch", count: "48%", color: "bg-amber-600" },
              { name: "Laxmi Nagar Branch", count: "92%", color: "bg-indigo-600" },
            ].map((branch, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700">{branch.name}</span>
                  <span className="text-slate-500">{branch.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${branch.color}`} style={{ width: branch.count }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
