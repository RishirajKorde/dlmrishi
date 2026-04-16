import React from 'react';

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
  </div>
);

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
