import React, { useState } from 'react';
import { Search, Plus, Mail, Phone, Calendar, AtSign, CreditCard, Eye, Edit2, Trash2, ShieldCheck, UserCheck } from 'lucide-react';
import Modal from '../components/Modal';
import { Input, Select, Button } from '../components/FormComponents';

const Members = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [members, setMembers] = useState([
    {
      id: "NMC-LIB-2025-00012",
      member_id: 1,
      membership_no: "NMC-LIB-2025-00012",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      mobile: "+91 98765 43210",
      aadhaar_no: "XXXX-ENCRYPTED",
      photo_path: "",
      type: "Standard",
      membership_type: "Standard",
      valid_from: "2025-01-01",
      valid_to: "2025-10-12",
      expiry: "12 Oct 2025",
      branch_id: 1,
      status: "Active",
      created_at: "2025-01-01"
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Standard',

    membership_no: '',
    mobile: '',
    aadhaar_no: '',
    photo_path: '',
    membership_type: 'Standard',
    valid_from: '',
    valid_to: '',
    branch_id: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
      setEditingMember(null);
    } else {
      const newMember = {
        ...formData,
        id: `NMC-LIB-2025-0${Math.floor(1000 + Math.random() * 9000)}`,
        member_id: Date.now(),
        membership_no: formData.membership_no,
        mobile: formData.phone,
        membership_type: formData.type,
        expiry: formData.valid_to || "16 Apr 2026",
        status: "Active",
        created_at: new Date().toISOString().split('T')[0]
      };
      setMembers([newMember, ...members]);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', type: 'Standard' });
    setEditingMember(null);
  };

  const handleEditClick = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      type: member.type
    });
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setMembers(members.filter(m => m.id !== memberToDelete.id));
    setIsDeleteModalOpen(false);
    setMemberToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all duration-300">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Name, Member ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[13px] transition-all"
          />
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
          <Plus size={18} />
          <span>Add </span>
        </Button>
      </div>

      {/* Member List View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>

                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Member Info</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Plan</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Contact</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Expiry Date</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold">Status</th>
                <th className="px-6 py-4 text-[9px] uppercase tracking-widest text-slate-500 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {members.map((member, index) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-[13px]">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 font-bold text-[11px] border border-blue-100 transition-transform group-hover:scale-105">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[13px]">{member.name}</p>
                        <p className="text-[9px] text-blue-600 font-mono tracking-tighter uppercase font-bold opacity-70">{member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-slate-700 font-bold">{member.type}</span>
                      <span className="text-[9px] text-slate-400 font-medium">Annual Plan</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Mail size={12} className="text-slate-400" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Phone size={12} className="text-slate-400" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-600 whitespace-nowrap">
                    {member.expiry}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-block border ${member.status === 'Active'
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                      : 'text-amber-600 bg-amber-50 border-amber-100'
                      }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                      <button
                        onClick={() => setViewingMember(member)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEditClick(member)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Edit Record"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => { setMemberToDelete(member); setIsDeleteModalOpen(true); }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingMember ? "Edit Member Profile" : "Add New Library Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            placeholder="Enter member's full name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone Number"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <Input
            label="Membership No"
            placeholder="Enter membership no"
            value={formData.membership_no}
            onChange={e => setFormData({ ...formData, membership_no: e.target.value })}
          />

          <Input
            label="Aadhaar No"
            placeholder="Encrypted Aadhaar"
            value={formData.aadhaar_no}
            onChange={e => setFormData({ ...formData, aadhaar_no: e.target.value })}
          />
          <Select
            label="Membership Plan"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            options={[
              { label: 'Standard (₹500/year)', value: 'Standard' },
              { label: 'Premium (₹1200/year)', value: 'Premium' },
              { label: 'Student (Free)', value: 'Student' }
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Valid From"
              type="date"
              value={formData.valid_from}
              onChange={e => setFormData({ ...formData, valid_from: e.target.value })}
            />

            <Input
              label="Valid To"
              type="date"
              value={formData.valid_to}
              onChange={e => setFormData({ ...formData, valid_to: e.target.value })}
            />
          </div>

          <Input
            label="Branch ID"
            placeholder="Enter branch id"
            value={formData.branch_id}
            onChange={e => setFormData({ ...formData, branch_id: e.target.value })}
          />

          <Input
            label="Photo"
            type="file"
            onChange={e => setFormData({ ...formData, photo_path: e.target.files[0] })}
          />
          <div className="pt-4 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => { setIsModalOpen(false); resetForm(); }} type="button">
              Cancel
            </Button>
            <Button className="flex-1" type="submit">
              {editingMember ? "Save Changes" : "Register Member"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewingMember}
        onClose={() => setViewingMember(null)}
        title="Member Details"
      >
        {viewingMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100">
                {viewingMember.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-[19px] font-bold text-slate-900">{viewingMember.name}</h4>
                <p className="text-[11px] font-mono text-blue-600 font-bold uppercase tracking-wider">{viewingMember.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Plan Type</p>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck size={16} className="text-blue-500" />
                  <span className="text-[13px] font-bold">{viewingMember.type}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Status</p>
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className={viewingMember.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'} />
                  <span className={`text-[13px] font-bold ${viewingMember.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>{viewingMember.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Email Address</p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-[13px]">{viewingMember.email}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Phone Number</p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-[13px]">{viewingMember.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Membership Expiry</p>
                  <p className="text-[13px] font-bold text-slate-700">{viewingMember.expiry}</p>
                </div>
                <Calendar className="text-slate-300" size={24} />
              </div>
            </div>

            <Button onClick={() => setViewingMember(null)} className="w-full">
              Close Details
            </Button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Member"
      >
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto border border-rose-100">
            <Trash2 size={32} />
          </div>
          <div>
            <h4 className="text-[19px] font-bold text-slate-900">Are you sure?</h4>
            <p className="text-[13px] text-slate-500 px-6">
              You are about to delete <span className="font-bold text-slate-900">{memberToDelete?.name}</span>. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteModalOpen(false)}>
              No, Keep
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Members;

