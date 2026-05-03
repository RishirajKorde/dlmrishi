import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Menu,
  Search,
  User,
  Settings,
  ChevronDown,
  LogOut
} from 'lucide-react';

const Navbar = ({ onMenuClick, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const pageTitle = location.pathname === '/' ? 'Dashboard' : location.pathname.split('/').pop() || 'Dashboard';

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all"
          >
            <Menu size={24} />
          </button>
        )}
        <h2 className="text-[19px] font-bold text-slate-900 capitalize tracking-tight">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        {/* Search Input - Desktop Only */}
        {/* {!isMobile && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-64 transition-all text-[13px] font-medium"
            />
          </div>
        )} */}

        <div className="flex items-center gap-3">
          {/* <button className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button> */}

          <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-3 relative group">
            <button className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-2xl transition-all group">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-slate-800 leading-tight">{userData.name || 'Admin User'}</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{userData.role || 'Super Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 group-hover:border-blue-200 group-hover:text-blue-600 transition-all overflow-hidden shadow-sm">
                <User size={20} />
              </div>
            </button>

            {/* Simple Dropdown/Logout Overlay */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-[13px] font-bold"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
