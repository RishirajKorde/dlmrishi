import React, { useState } from 'react';
import {
  Search, BookOpen, Users, Building2,
  ArrowRight, Star, Clock, ShieldCheck,
  ChevronRight, BookMarked, Globe, Sparkles,
  MapPin, Library, GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchPortal = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Books', value: '1.2M+', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { label: 'Active Members', value: '45K+', icon: Users, color: 'from-emerald-500 to-teal-600' },
    { label: 'Branches', value: '18', icon: Building2, color: 'from-orange-500 to-red-600' },
    { label: 'E-Resources', value: '150K+', icon: Globe, color: 'from-purple-500 to-pink-600' },
  ];

  const featuredBooks = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', rating: 4.8, color: 'from-blue-600 to-indigo-700' },
    { id: 2, title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance', rating: 4.9, color: 'from-emerald-600 to-teal-700' },
    { id: 3, title: 'Deep Work', author: 'Cal Newport', category: 'Productivity', rating: 4.7, color: 'from-orange-600 to-amber-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles size={14} />
            Unified Digital Library System
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Discover Your Next <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Great Adventure</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-500 text-lg mb-10 leading-relaxed">
            Access millions of books, research papers, and digital resources across all Nagpur Municipal Corporation libraries from a single dashboard.
          </p>

          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-2 border border-slate-200">
              <div className="flex-1 flex items-center px-4">
                <Search className="text-slate-400 mr-3" size={24} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Title, Author, ISBN, or Subject..."
                  className="w-full py-4 text-lg text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              <button className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                Find Books
                <ArrowRight size={20} />
              </button>
              <button className="md:hidden flex items-center justify-center bg-slate-900 text-white w-14 h-14 rounded-xl shadow-lg">
                <Search size={24} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-emerald-500" /> Secure Access</span>
            <span className="flex items-center gap-1"><Clock size={16} className="text-blue-500" /> 24/7 Digital Library</span>
            <span className="flex items-center gap-1"><Star size={16} className="text-amber-500" /> 4.9/5 User Rating</span>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 group hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-blue-100`}>
                  <stat.icon size={24} />
                </div>
                <div className="text-slate-300 group-hover:text-slate-400 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Column: Trending & Quick Access */}
        <div className="lg:col-span-2 space-y-12">

          {/* New Arrivals */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookMarked className="text-blue-600" />
                Featured Arrivals
              </h2>
              <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                  <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${book.color} mb-4 overflow-hidden relative flex flex-col items-center justify-center p-6 shadow-inner`}>
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]"></div>
                    <BookOpen size={48} className="text-white/40 mb-4 group-hover:scale-110 transition-transform duration-500" />
                    <div className="text-white font-black text-center text-sm leading-tight px-2 drop-shadow-md">
                      {book.title}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 h-0.5 bg-white/20 rounded-full"></div>

                    <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                      <Star size={10} className="fill-white" />
                      {book.rating}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{book.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                      {book.category}
                    </span>
                    <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Categories */}
          <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="relative">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Explore by Category</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'Science', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { name: 'Literature', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { name: 'Technology', icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { name: 'Branches', icon: MapPin, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((cat, i) => (
                  <button key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group">
                    <div className={`w-14 h-14 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <cat.icon size={28} />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Member Portal / Info */}
        <div className="space-y-8">

          {/* Membership Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 p-4 opacity-10">
              <Library size={120} />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-bold mb-4">Membership Required</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                To issue books, reserve items, or access premium e-content, you must be a registered member.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Issue up to 5 books',
                  '14-day renewal periods',
                  'Online book reservation',
                  'Personalized reading lists'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <ShieldCheck size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-white text-blue-700 font-black rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Login to Account
                </button>
                <button className="w-full py-3 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm">
                  Become a Member
                </button>
              </div>
            </div>
          </div>

          {/* Library Info */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              Nearest Branch
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-800 text-sm mb-1">Central Library, Civil Lines</div>
                <div className="text-xs text-slate-500 mb-3">Nagpur Municipal Corporation</div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-emerald-600">Open Now</span>
                  <span className="text-slate-400">Closes 8:00 PM</span>
                </div>
              </div>
              <button className="w-full py-3 text-blue-600 font-bold text-sm hover:bg-blue-50 rounded-xl transition-colors">
                View All 18 Branches
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer / Contact Mini */}
      <div className="max-w-7xl mx-auto px-4 mt-20 text-center">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8"></div>
        <p className="text-slate-400 text-sm">
          &copy; 2026 Nagpur Municipal Corporation Digital Library Management. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SearchPortal;

