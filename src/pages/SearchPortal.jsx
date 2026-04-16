import React from 'react';
import { Search, MapPin, Bookmark, ExternalLink } from 'lucide-react';

const SearchPortal = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Citizen Search Portal</h1>
        <p className="text-slate-500 text-lg">Browse the unified catalogue of all Nagpur Municipal Corporation libraries.</p>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full"></div>
        <div className="relative flex p-1 bg-white border-2 border-slate-100 rounded-2xl shadow-xl focus-within:border-blue-500 transition-all">
          <input 
            type="text" 
            placeholder="Search by Title, Author, or ISBN..." 
            className="flex-1 px-6 py-4 rounded-xl outline-none text-lg text-slate-800"
          />
          <button className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <Search size={22} />
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        {/* Availability Mock */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <Bookmark className="text-slate-200 group-hover:text-amber-400 transition-colors" size={32} />
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-4">
            <span>Result Found</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Atomic Habits</h3>
          <p className="text-slate-500 mb-6">James Clear • 978-0735211292</p>
          
          <div className="space-y-4">
            {[
              { branch: "Central Library", status: "Available", color: "text-emerald-600" },
              { branch: "Dharampeth Branch", status: "Checked Out", color: "text-rose-600" },
              { branch: "Sitabuldi Branch", status: "Available", color: "text-emerald-600" },
            ].map((lib, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <MapPin size={14} className="text-slate-400" />
                  {lib.branch}
                </div>
                <span className={`text-xs font-bold uppercase ${lib.color}`}>{lib.status}</span>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-3 border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
            Reserve for Pickup
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200">
          <h3 className="text-2xl font-bold mb-4">Become a Member</h3>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Gain full access to our physical and digital collections. Members can reserve books online, track borrowing history, and read premium eBooks.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">✓</div>
              <span>Borrow up to 3 books for 14 days</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">✓</div>
              <span>Unlimited access to Digital Content Library</span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0">✓</div>
              <span>SMS notifications for arrivals & due dates</span>
            </li>
          </ul>
          <button className="w-full py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors">
            Register for Membership
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPortal;
