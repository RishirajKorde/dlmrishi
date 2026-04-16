import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Save, 
  Lock, 
  Unlock, 
  ChevronRight,
  Settings2
} from 'lucide-react';
import { Button, Select } from '../components/FormComponents';

const Permissions = () => {
  const modules = [
    { id: 'dashboard', name: 'Dashboard', permissions: { view: true, add: false, edit: false, delete: false } },
    { id: 'catalogue', name: 'Catalogue', permissions: { view: true, add: true, edit: true, delete: false } },
    { id: 'members', name: 'Members', permissions: { view: true, add: true, edit: true, delete: true } },
    { id: 'transactions', name: 'Transactions', permissions: { view: true, add: true, edit: false, delete: false } },
    { id: 'reports', name: 'Reports', permissions: { view: true, add: false, edit: false, delete: false } },
    { id: 'roles', name: 'Role Management', permissions: { view: false, add: false, edit: false, delete: false } },
  ];

  const [selectedRole, setSelectedRole] = useState('Librarian');
  const [permState, setPermState] = useState(modules);

  const togglePermission = (moduleId, permType) => {
    setPermState(prev => prev.map(mod => {
      if (mod.id === moduleId) {
        return {
          ...mod,
          permissions: {
            ...mod.permissions,
            [permType]: !mod.permissions[permType]
          }
        };
      }
      return mod;
    }));
  };

  const handleSave = () => {
    alert(`Permissions for ${selectedRole} saved successfully!`);
  };

  const roles = [
    { label: 'Super Admin', value: 'Super Admin' },
    { label: 'Librarian', value: 'Librarian' },
    { label: 'Assistant Librarian', value: 'Assistant Librarian' },
    { label: 'Guest', value: 'Guest' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
            <Settings2 size={14} />
            <span>ACL Settings</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">Module Access Control</h3>
          <p className="text-sm text-slate-500 font-medium">Define fine-grained permissions for each library role.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <Select 
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              options={roles}
            />
          </div>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save size={18} />
            <span>Save Permissions</span>
          </Button>
        </div>
      </div>

      {/* Permission Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-6 text-sm font-bold text-slate-800">Module Name</th>
                <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-500">View</th>
                <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-500">Add</th>
                <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-500">Edit</th>
                <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-500">Update</th>
                <th className="px-6 py-6 text-center text-xs font-black uppercase tracking-widest text-slate-500">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {permState.map((mod) => (
                <tr key={mod.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${mod.permissions.view ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                        <ShieldCheck size={18} />
                      </div>
                      <span className="font-bold text-slate-800 text-base">{mod.name}</span>
                    </div>
                  </td>
                  
                  {['view', 'add', 'edit', 'update', 'delete'].map((type) => (
                    <td key={type} className="px-6 py-5">
                      <div className="flex justify-center">
                        <label className="relative inline-flex items-center cursor-pointer group/toggle">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={mod.permissions[type] || false}
                            onChange={() => togglePermission(mod.id, type)}
                          />
                          <div className={`
                            w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] 
                            after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
                            peer-checked:bg-blue-600 transition-all duration-300
                          `}></div>
                          <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/toggle:opacity-100 transition-all pointer-events-none capitalize">
                            {mod.permissions[type] ? <Unlock size={10} className="inline mr-1" /> : <Lock size={10} className="inline mr-1" />}
                            {type}
                          </div>
                        </label>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold">Security Tip</h4>
            <p className="text-slate-400 text-sm max-w-lg">
              Always follow the principle of least privilege. Grant only the minimum permissions required for a user to perform their job functions.
            </p>
          </div>
          <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 shrink-0">
            Audit Security Logs
            <ChevronRight size={16} />
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32"></div>
      </div>
    </div>
  );
};

export default Permissions;
