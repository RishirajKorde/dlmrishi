import React from 'react';
import { ArrowLeftRight, Search, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '../components/FormComponents';
import { toast } from 'react-toastify';

const Transactions = () => {
  const handleIssue = (e) => {
    e.preventDefault();
    toast.success("Book Issued Successfully!");
  };

  const handleReturn = (e) => {
    e.preventDefault();
    toast.success("Book Returned Successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Issue Book Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <ArrowLeftRight size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Issue Book</h3>
        </div>
        
        <form onSubmit={handleIssue} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Member ID / QR Code</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="NMC-LIB-2025-XXXXX" 
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                required
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Book Barcode / ISBN</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter ISBN or scan barcode" 
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                required
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-sm text-slate-500 text-center">Scan QR/Barcode to auto-populate details</p>
          </div>

          <Button type="submit" className="w-full py-4">
            Confirm Issuance
          </Button>
        </form>
      </div>

      {/* Return Book Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Return Book</h3>
        </div>

        <form onSubmit={handleReturn} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Book Barcode</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Scan book barcode to return" 
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                required
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          {/* Return Info Mock */}
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 space-y-4">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
              <AlertTriangle size={16} />
              <span>Pending Fine Detected</span>
            </div>
            <div className="flex justify-between items-center text-amber-600">
              <span className="text-sm">Overdue Fine (3 days):</span>
              <span className="text-lg font-bold">₹30.00</span>
            </div>
          </div>

          <Button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200">
            Collect Fine & Complete Return
          </Button>
        </form>
      </div>

      {/* Recent Activity Log */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-slate-900">Today's Activity Log</h3>
        </div>
        <div className="p-0">
          {[
            { time: "11:45 AM", type: "Return", member: "Rahul Sharma", book: "Atomic Habits", fine: "₹0" },
            { time: "11:20 AM", type: "Issue", member: "Priya Verma", book: "The Alchemist", fine: "-" },
            { time: "10:55 AM", type: "Return", member: "Amit Patel", book: "Deep Work", fine: "₹30" },
          ].map((log, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-slate-400 text-xs font-mono">{log.time}</div>
                <div className={`w-2 h-2 rounded-full ${log.type === 'Issue' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{log.type}: {log.book}</p>
                  <p className="text-xs text-slate-500">Member: {log.member}</p>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600">
                {log.fine !== '-' && <span className="text-amber-600 font-bold">{log.fine}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
