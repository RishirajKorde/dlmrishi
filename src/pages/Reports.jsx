import React from 'react';
import { BarChart3, TrendingUp, PieChart, ArrowDownToLine, Filter } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-8">
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-slate-800">Reports Cabinet</h3>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <span className="text-sm text-slate-500">Last updated: Today, 08:30 AM</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            <span className="font-medium text-sm">Monthly Range</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-colors">
            <ArrowDownToLine size={18} />
            <span className="font-medium text-sm">Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Borrowing Trends Chart Mock */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Borrowing Trends</h3>
              <p className="text-sm text-slate-500">Monthly book circulation volume</p>
            </div>
            <TrendingUp size={24} className="text-emerald-500" />
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4">
            {[45, 62, 38, 75, 52, 90, 68].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-all duration-300 relative cursor-pointer" 
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {height * 10} Books
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown Mock */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Category Distribution</h3>
              <p className="text-sm text-slate-500">Book inventory by genre</p>
            </div>
            <PieChart size={24} className="text-blue-500" />
          </div>

          <div className="flex items-center gap-8">
            {/* Simple Pie Simulation */}
            <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-blue-600 border-l-transparent border-b-transparent rotate-45"></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-emerald-500 border-t-transparent border-r-transparent -rotate-12"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-800">45k</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Books</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { label: "Technology", value: "35%", color: "bg-blue-600" },
                { label: "Literature", value: "28%", color: "bg-emerald-500" },
                { label: "History", value: "22%", color: "bg-amber-500" },
                { label: "Medicine", value: "15%", color: "bg-slate-300" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-slate-600 font-medium">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables or specialized lists would go here as per 3.8.1 in SRS */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-6">Top Borrowed Titles</h3>
        <div className="space-y-4">
          {[
            { title: "Atomic Habits", count: "1,240", growth: "+15%" },
            { title: "Sapiens", count: "980", growth: "+8%" },
            { title: "The Alchemist", count: "850", growth: "-2%" },
            { title: "Clean Code", count: "620", growth: "+22%" },
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
              <span className="font-bold text-slate-800">{idx + 1}. {item.title}</span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-500">{item.count} borrows</span>
                <span className={`text-xs font-bold ${item.growth.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.growth}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
