import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

export const Input = ({ label, type = "text", ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-[13px] font-bold text-slate-700 ml-1">{label}</label>}
    <input
      type={type}
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-[13px]"
      {...props}
    />
  </div>
);

export const Select = ({ label, options, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="text-[13px] font-bold text-slate-700 ml-1">{label}</label>}
    <div className="relative">
      <select
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer text-slate-700 text-[13px]"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
);

export const SearchableSelect = ({ label, options, value, onChange, placeholder = "Select option...", ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      {label && <label className="text-[13px] font-bold text-slate-700 ml-1">{label}</label>}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-slate-50 border ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} rounded-xl cursor-pointer transition-all flex items-center justify-between text-[13px] ${!selectedOption ? 'text-slate-400' : 'text-slate-700'}`}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-2 border-b border-slate-50 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  autoFocus
                  type="text"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[12px] outline-none focus:border-blue-500 transition-all"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`px-4 py-2.5 text-[13px] cursor-pointer transition-colors hover:bg-blue-50 flex items-center justify-between ${String(opt.value) === String(value) ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
                    onClick={() => {
                      onChange({ target: { value: opt.value } });
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    {opt.label}
                    {String(opt.value) === String(value) && <Search size={14} className="text-blue-500" />}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-400 text-[12px]">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
    secondary: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    outline: "border-2 border-slate-100 text-slate-600 hover:bg-slate-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-100",
  };

  return (
    <button
      className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
