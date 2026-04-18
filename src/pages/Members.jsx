import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2Icon, Eye } from 'lucide-react';
import Modal from '../components/Modal';
import { Input, Select, Button } from '../components/FormComponents';
import api from '../api/axios';

const Members = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMember, setViewingMember] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    aadhaarNumber: '',
    branchId: '',
    validityMonths: '',
    address: '',
    photo: null
  });

  // =========================
  // LOAD
  // =========================
  useEffect(() => {
    fetchMembers();
    fetchBranches();
  }, []);

  // =========================
  // FETCH MEMBERS
  // =========================
  const fetchMembers = async () => {
    try {
      const res = await api.get('/api/v1/branch-admin/librarians/members');

      if (res.data?.status === 200) {
        let list = res.data.data;
        if (list?.content) list = list.content;

        const formatted = (list || []).map((m) => ({
          id: m.memberId || m.id,
          name: m.name,
          email: m.email,
          mobile: m.mobile,
          branchId: m.branchId || m.branch?.branchId,
          branchName: m.branchName || m.branch?.branchName,
          validityMonths: m.validityMonths
        }));

        setMembers(formatted);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // FETCH BRANCHES
  // =========================
  const fetchBranches = async () => {
    try {
      const res = await api.get('/api/v1/admin/branches');

      if (res.data?.status === 200) {
        setBranches(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // ADD / UPDATE (FORMDATA)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("mobile", formData.mobile);
      fd.append("aadhaarNumber", formData.aadhaarNumber);
      fd.append("branchId", Number(formData.branchId));
      fd.append("validityMonths", formData.validityMonths);
      fd.append("address", formData.address);

      if (formData.photo) {
        fd.append("photo", formData.photo);
      }

      let res;

      if (editingMember) {
        res = await api.put(
          `/api/v1/branch-admin/librarians/member/${editingMember.id}`,
          fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        res = await api.post(
          '/api/v1/branch-admin/librarians/members',
          fd,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      // ✅ NOW THIS WILL WORK
      if (res.data?.status === 200 || res.status === 200) {
        await fetchMembers();   // 🔥 important
        resetForm();
        setIsModalOpen(false);
      }

    } catch (error) {
      console.error(error);
    }
  };
  // =========================
  // EDIT
  // =========================
  const handleEditClick = (m) => {
    setEditingMember(m);

    setFormData({
      ...m,
      photo: null
    });

    setIsModalOpen(true);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      await api.delete(`/api/v1/branch-admin/librarians/members/${id}`);
      fetchMembers();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      aadhaarNumber: '',
      branchId: '',
      validityMonths: '',
      address: '',
      photo: null
    });
    setEditingMember(null);
  };

  return (
    <div className="space-y-6">

      {/* HEADER (UNCHANGED) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search Member..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px]"
          />
        </div>

        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2">
          <Plus size={18} />
          <span>Add</span>
        </Button>
      </div>

      {/* TABLE (UNCHANGED STYLE) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Sr No</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Name</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Mobile</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Branch</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold">Validity</th>
                <th className="px-6 py-4 text-[9px] uppercase font-bold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {members.map((m, index) => (
                <tr key={m.id} className="hover:bg-slate-50/50">

                  <td className="px-6 py-4 text-[13px]">{index + 1}</td>

                  <td className="px-6 py-4 text-[13px] font-bold">
                    {m.name}
                  </td>

                  <td className="px-6 py-4 text-[13px]">
                    {m.mobile}
                  </td>

                  <td className="px-6 py-4 text-[13px]">
                    {m.branchName}
                  </td>

                  <td className="px-6 py-4 text-[13px]">
                    {m.validityMonths} Months
                  </td>

                  <td className="px-6 py-4 text-right gap-1.5">
                    {/* 👁 VIEW */}
                    <button
                      onClick={() => {
                        setViewingMember(m);
                        setIsViewModalOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleEditClick(m)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL (UNCHANGED STYLE) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Member" : "Add Member"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          <Input label="Name" value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })} />

          <Input label="Email" value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} />

          <Input label="Mobile" value={formData.mobile}
            onChange={e => setFormData({ ...formData, mobile: e.target.value })} />

          <Input label="Aadhaar"
            value={formData.aadhaarNumber}
            onChange={e => setFormData({ ...formData, aadhaarNumber: e.target.value })} />

          <Select
            label="Branch"
            value={formData.branchId}
            onChange={e => setFormData({ ...formData, branchId: e.target.value })}
            options={[
              { label: 'Select Branch', value: '' },
              ...branches.map(b => ({
                label: b.branchName,
                value: b.branchId
              }))
            ]}
          />

          <Select
            label="Validity"
            value={formData.validityMonths}
            onChange={e => setFormData({ ...formData, validityMonths: e.target.value })}
            options={[
              { label: '3 Months', value: 3 },
              { label: '6 Months', value: 6 },
              { label: '12 Months', value: 12 }
            ]}
          />

          <Input label="Address"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })} />

          <input type="file"
            onChange={e => setFormData({ ...formData, photo: e.target.files[0] })}
          />

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" type="submit">
              {editingMember ? "Update" : "Save"}
            </Button>
          </div>

        </form>
      </Modal>

      {/* view modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Member Details"
      >
        {viewingMember && (
          <div className="space-y-4 text-[13px]">

            <div>
              <p className="text-slate-400">Name</p>
              <p className="font-bold">{viewingMember.name}</p>
            </div>

            <div>
              <p className="text-slate-400">Email</p>
              <p className="font-bold">{viewingMember.email}</p>
            </div>

            <div>
              <p className="text-slate-400">Mobile</p>
              <p className="font-bold">{viewingMember.mobile}</p>
            </div>

            <div>
              <p className="text-slate-400">Aadhaar</p>
              <p className="font-bold">{viewingMember.aadhaarNumber}</p>
            </div>

            <div>
              <p className="text-slate-400">Branch</p>
              <p className="font-bold">{viewingMember.branchName}</p>
            </div>

            <div>
              <p className="text-slate-400">Validity</p>
              <p className="font-bold">{viewingMember.validityMonths} Months</p>
            </div>

            <div>
              <p className="text-slate-400">Address</p>
              <p className="font-bold">{viewingMember.address}</p>
            </div>

            {/* 🖼 PHOTO */}
            {viewingMember.photo && (
              <div>
                <p className="text-slate-400 mb-1">Photo</p>
                <img
                  src={viewingMember.photo}
                  alt="member"
                  className="w-24 h-24 rounded border object-cover"
                />
              </div>
            )}

          </div>
        )}
      </Modal>
    </div>
  );
};

export default Members;