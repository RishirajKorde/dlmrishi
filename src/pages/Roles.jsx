import React, { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import Modal from '../components/Modal';
import { Input, Button, Select } from '../components/FormComponents';
import { toast } from 'react-toastify';

const Roles = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roles, setRoles] = useState([
    { id: 1, name: 'Super Admin', status: 'Active', members: 2, created: '2023-01-15' },
    { id: 2, name: 'Librarian', status: 'Active', members: 5, created: '2023-02-10' },
    { id: 3, name: 'Assistant Librarian', status: 'Active', members: 8, created: '2023-03-05' },
    { id: 4, name: 'Guest/Public', status: 'Deactive', members: 0, created: '2023-04-20' },
  ]);

  const [formData, setFormData] = useState({ name: '', status: 'Active' });

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({ name: role.name, status: role.status });
    } else {
      setEditingRole(null);
      setFormData({ name: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
      toast.success('Role updated successfully!');
    } else {
      const newRole = {
        id: Date.now(),
        ...formData,
        members: 0,
        created: new Date().toISOString().split('T')[0]
      };
      setRoles([newRole, ...roles]);
      toast.success('Role created successfully!');
    }
    setIsModalOpen(false);
  };

  const deleteRole = (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(r => r.id !== id));
      toast.success('Role deleted successfully!');
    }
  };

  const toggleStatus = (id) => {
    setRoles(roles.map(r =>
      r.id === id ? { ...r, status: r.status === 'Active' ? 'Deactive' : 'Active' } : r
    ));
    toast.success('Status updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search roles..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
          />
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full md:w-auto">
          <Plus size={18} />
          <span>Add</span>
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Role Name</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Total Members</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Created At</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <ShieldAlert size={18} />
                      </div>
                      <span className="font-bold text-slate-800">{role.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(role.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${role.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                    >
                      {role.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {role.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {role.members} User{role.members !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {role.created}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenModal(role)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteRole(role.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? 'Update Role' : 'Create New Role'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Role Name"
            placeholder="e.g. Senior Librarian"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Select
            label="Initial Status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Deactive', value: 'Deactive' }
            ]}
          />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" type="submit">
              {editingRole ? 'Save Changes' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Roles;
