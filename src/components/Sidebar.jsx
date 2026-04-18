import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  Library,
  Search,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  ChevronDown,
  GitBranch,
  GitBranchIcon,
  User2Icon,
  Eye,
  UserRoundKey
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, active, isCollapsed, isSubItem = false }) => (
  <Link
    to={to}
    className={`flex items-center rounded-xl transition-all duration-300 group relative ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
      } ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      } ${isSubItem && !isCollapsed ? 'ml-6' : ''}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'} flex-shrink-0`}>
      <Icon size={isSubItem ? 16 : 20} />
    </div>
    {!isCollapsed && (
      <span className="font-medium whitespace-nowrap overflow-hidden transition-all duration-300 text-[13px]">
        {label}
      </span>
    )}
    {isCollapsed && (
      <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-medium rounded-lg hidden group-hover:block pointer-events-none transition-all translate-x-1 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl border border-white/10 backdrop-blur-sm">
        {label}
      </div>
    )}
  </Link>
);

const Sidebar = ({ isCollapsed, setCollapsed, isMobile, isOpen, onClose }) => {
  const location = useLocation();
  const [isMasterOpen, setIsMasterOpen] = useState(
    location.pathname.includes('/roles') || location.pathname.includes('/permissions')
  );

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/catalogue', icon: BookOpen, label: 'Catalogue' },
    { to: '/members', icon: Users, label: 'Members' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/library', icon: Library, label: 'Digital Library' },
    { to: '/search', icon: Search, label: 'Public Portal' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const masterItems = [
    // { to: '/roles', icon: UserRoundKey, label: 'Roles' },
    // { to: '/permissions', icon: Eye, label: 'Permissions' },
        { to: '/Categories', icon: GitBranchIcon, label: 'Categories' },
    { to: '/Subjects', icon: User2Icon, label: 'Subjects' },

    { to: '/branch', icon: GitBranchIcon, label: 'Branch' },
    { to: '/users', icon: User2Icon, label: 'Librarian' },

  ];

  const sidebarClasses = `
    bg-white border-r border-slate-200 flex flex-col transition-all duration-300 h-screen overflow-x-hidden flex-shrink-0
    ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
    ${isMobile ? 'fixed z-50' : 'relative'}
    ${!isMobile && isCollapsed ? 'w-20' : 'w-72'}
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed && !isMobile ? 'p-3' : 'p-6'}`}>
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'} mb-10`}>
            <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
              <div className="min-w-[40px] h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 transition-transform duration-300 hover:scale-105 active:scale-95">
                <Library size={24} />
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="transition-all duration-300 overflow-hidden whitespace-nowrap">
                  <h1 className="text-[19px] font-bold tracking-tight text-slate-900">DLMS</h1>
                  <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Nagpur Library</p>
                </div>
              )}
            </div>
          </div>

          <nav className="space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
            <p className={`text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-4 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'px-4'}`}>
              <span className="w-1.5 h-[1px] bg-slate-200 mr-2 rounded-full block"></span>
              {isCollapsed && !isMobile ? 'Menu' : 'Main Menu'}
            </p>
            {menuItems.map((item) => (
              <SidebarLink
                key={item.to}
                {...item}
                active={location.pathname === item.to}
                isCollapsed={isCollapsed && !isMobile}
              />
            ))}

            {/* Master Dropdown */}
            <div className="space-y-1.5 pt-1.5">
              <button
                onClick={() => setIsMasterOpen(!isMasterOpen)}
                className={`flex items-center rounded-xl transition-all duration-300 group ${isCollapsed && !isMobile ? 'justify-center p-3' : 'gap-3 px-4 py-3 w-full items-center'
                  } ${(location.pathname.includes('/roles') || location.pathname.includes('/permissions')) && !isCollapsed
                    ? 'text-blue-600 bg-blue-50/50'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                  <Settings size={20} />
                </div>
                {(!isCollapsed || isMobile) && (
                  <>
                    <span className="font-bold flex-1 text-left text-[13px]">Master Settings</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 text-slate-400 ${isMasterOpen ? 'rotate-180' : ''}`}
                    />
                  </>
                )}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-medium rounded-lg hidden group-hover:block pointer-events-none transition-all translate-x-1 group-hover:translate-x-0 whitespace-nowrap z-50 shadow-xl border border-white/10 backdrop-blur-sm">
                    Master Config
                  </div>
                )}
              </button>

              {isMasterOpen && (!isCollapsed || isMobile) && (
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {masterItems.map((item) => (
                    <SidebarLink
                      key={item.to}
                      {...item}
                      active={location.pathname === item.to}
                      isCollapsed={false}
                      isSubItem={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
            {!isMobile && (
              <button
                onClick={() => setCollapsed(!isCollapsed)}
                className={`flex items-center rounded-xl transition-all duration-300 group ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3 w-full'
                  } text-slate-400 hover:text-blue-600 hover:bg-blue-50`}
              >
                <div className="transition-transform duration-300 group-hover:rotate-180">
                  {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </div>
                {!isCollapsed && <span className="font-medium text-[13px]"></span>}
              </button>
            )}
            <button className={`flex items-center rounded-xl transition-all duration-300 group ${isCollapsed && !isMobile ? 'justify-center p-3' : 'gap-3 px-4 py-3 w-full'
              } text-slate-400 hover:text-red-600 hover:bg-red-50`}>
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="font-medium text-[13px] text-left">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
